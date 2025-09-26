import {
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Table as TremorTable,
} from "@tremor/react";
import Papa from "papaparse";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";
import FormSearch from "@/components/button/form-search";
import ExportButton from "@/components/button/export-button";
import React, { useState, useMemo, useRef, useEffect } from "react";

export interface ITableColumn {
  key: string;
  label: string;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  resizable?: boolean;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ITableProps<T> {
  columns: ITableColumn[];
  data: T[];
  exportable?: boolean;
  exportData?: T[];
  title?: string;
  paginate?: boolean;
  noHeader?: boolean;
  additionalButton?: React.ReactNode;
  isLoading?: boolean;
  // Backend pagination support
  pagination?: PaginationInfo;
  onPageChange?: (page: number) => void;
  rowsPerPage?: number;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  // Sorting support
  sortBy?: string | null;
  sortOrder?: "asc" | "desc";
  onSortChange?: (sortBy: string, sortOrder: "asc" | "desc") => void;
  // External search support
  externalSearchValue?: string;
  onExternalSearchChange?: (value: string) => void;
  showSearch?: boolean;
}

export interface IRow {
  [key: string]: string | number | React.ReactElement;
}

export type IRowWithDisplay = IRow & {
  _display?: Record<string, React.ReactElement>;
};

export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  exportData,
  exportable,
  title,
  paginate = false,
  noHeader = false,
  additionalButton,
  isLoading = false,
  pagination,
  onPageChange,
  rowsPerPage = 25,
  onRowsPerPageChange,
  sortBy,
  sortOrder,
  onSortChange,
  externalSearchValue,
  onExternalSearchChange,
  showSearch = true,
}: ITableProps<T>) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string | null;
    direction: string;
  }>({
    key: sortBy || null,
    direction: sortOrder === "asc" ? "ascending" : "descending",
  });
  const [currentPage, setCurrentPage] = useState(pagination?.page || 1);
  const effectiveRowsPerPage = paginate ? rowsPerPage : data.length;

  // Sync internal sort config with external props
  useEffect(() => {
    setSortConfig({
      key: sortBy || null,
      direction: sortOrder === "asc" ? "ascending" : "descending",
    });
  }, [sortBy, sortOrder]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Column width management
  const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>(
    () => {
      const initialWidths: { [key: string]: number } = {};
      columns.forEach((column) => {
        initialWidths[column.key] = column.width || 150;
      });
      return initialWidths;
    }
  );

  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const tableRef = useRef<HTMLDivElement>(null);

  const filteredData = useMemo(() => {
    // If backend pagination is used, don't filter locally
    if (pagination) {
      return data;
    }

    // Use external search value if provided, otherwise use debounced internal search
    const searchValue =
      externalSearchValue !== undefined
        ? externalSearchValue
        : debouncedSearchQuery;

    return data.filter((row) => {
      const rowValues = columns
        .map((column) => String((row as IRow)[column.key] ?? ""))
        .join(" ")
        .toLowerCase();

      return rowValues.includes(searchValue.toLowerCase());
    });
  }, [data, columns, debouncedSearchQuery, externalSearchValue, pagination]);

  // Reset to first page when search changes (for client-side pagination)
  useEffect(() => {
    if (!pagination) {
      setCurrentPage(1);
    }
  }, [debouncedSearchQuery, externalSearchValue, pagination]);

  const sortedData = useMemo(() => {
    // If external sorting is provided and we're using backend pagination, don't sort locally
    if (pagination && onSortChange) {
      return filteredData;
    }

    // Use internal sorting for client-side data
    if (sortConfig.key != null && sortConfig.direction != undefined) {
      return [...filteredData].sort((a: T, b: T) => {
        const aValue = a[sortConfig.key as keyof T];
        const bValue = b[sortConfig.key as keyof T];

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return filteredData;
  }, [filteredData, sortConfig, pagination, onSortChange]);

  const exportToCSV = () => {
    const csv = Papa.unparse(exportData || filteredData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", title + ".csv" || "table_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSort = (columnKey: string) => {
    let direction = "ascending";
    if (sortConfig.key === columnKey && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key: columnKey, direction });

    // Call external sort handler if provided
    if (onSortChange) {
      onSortChange(columnKey, direction === "ascending" ? "asc" : "desc");
    }
  };

  // Resizing handlers
  const handleMouseDown = (e: React.MouseEvent, columnKey: string) => {
    e.preventDefault();
    setIsResizing(columnKey);
    setStartX(e.clientX);
    setStartWidth(columnWidths[columnKey]);
  };

  // Add event listeners for mouse events
  useEffect(() => {
    const handleMouseMoveCallback = (e: MouseEvent) => {
      if (!isResizing) return;

      const column = columns.find((col) => col.key === isResizing);
      if (!column) return;

      const diff = e.clientX - startX;
      const newWidth = Math.max(
        column.minWidth || 80,
        Math.min(column.maxWidth || 500, startWidth + diff)
      );

      setColumnWidths((prev) => ({
        ...prev,
        [isResizing]: newWidth,
      }));
    };

    const handleMouseUpCallback = () => {
      setIsResizing(null);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMoveCallback);
      document.addEventListener("mouseup", handleMouseUpCallback);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMoveCallback);
      document.removeEventListener("mouseup", handleMouseUpCallback);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, startX, startWidth, columns]);

  // Sync current page with backend pagination
  useEffect(() => {
    if (pagination) {
      setCurrentPage(pagination.page);
    }
  }, [pagination]);

  // Determine pagination info
  const paginationInfo = useMemo(() => {
    if (pagination) {
      // Use backend pagination info
      return {
        totalPages: pagination.pages,
        totalItems: pagination.total,
        currentPage: pagination.page,
        itemsPerPage: pagination.limit,
      };
    } else {
      // Use client-side pagination info
      return {
        totalPages: Math.ceil(filteredData.length / effectiveRowsPerPage),
        totalItems: filteredData.length,
        currentPage: currentPage,
        itemsPerPage: effectiveRowsPerPage,
      };
    }
  }, [pagination, filteredData.length, effectiveRowsPerPage, currentPage]);

  const paginatedData = useMemo(() => {
    if (pagination) {
      // Backend pagination - use data as-is
      return sortedData;
    } else {
      // Client-side pagination
      const startIndex = (currentPage - 1) * effectiveRowsPerPage;
      return sortedData.slice(startIndex, startIndex + effectiveRowsPerPage);
    }
  }, [currentPage, effectiveRowsPerPage, sortedData, pagination]);

  return (
    <div className="w-full overflow-hidden">
      <div className="flex justify-between items-center mb-4 space-x-4">
        {showSearch && (
          <div className="flex items-center gap-2 flex-1">
            <FormSearch
              value={
                externalSearchValue !== undefined
                  ? externalSearchValue
                  : searchQuery
              }
              handleChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value;
                if (onExternalSearchChange) {
                  onExternalSearchChange(value);
                } else {
                  setSearchQuery(value);
                }
              }}
            />
            {isLoading && (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>
        )}
        <div className="flex items-center space-x-2">
          {exportable && <ExportButton handleClick={exportToCSV} />}
          {additionalButton}
        </div>
      </div>

      <div className="w-full overflow-x-auto custom-scrollbar" ref={tableRef}>
        <TremorTable style={{ width: "max-content", minWidth: "100%" }}>
          <TableHead
            className={`${noHeader ? "hidden" : "bg-subprimary text-darkBlue"}`}
          >
            <TableRow>
              <TableHeaderCell
                className="py-3 px-4"
                style={{ width: "40px", minWidth: "40px" }}
              >
                #
              </TableHeaderCell>
              {columns.map((column, index) => (
                <TableHeaderCell
                  key={column.key}
                  className="py-3 px-4 cursor-pointer whitespace-nowrap relative"
                  style={{
                    width: `${columnWidths[column.key]}px`,
                    minWidth: `${columnWidths[column.key]}px`,
                    maxWidth: `${columnWidths[column.key]}px`,
                  }}
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-black text-sm font-medium">
                      {column.label}
                    </span>
                    <Icon
                      icon={
                        sortConfig.key === column.key &&
                        sortConfig.direction === "ascending"
                          ? "ic:outline-keyboard-arrow-up"
                          : "ic:outline-keyboard-arrow-down"
                      }
                      className={`w-4 h-4 ${
                        sortConfig.key === column.key
                          ? "text-blue-600"
                          : "text-gray-400"
                      }`}
                    />
                  </div>

                  {/* Resize handle */}
                  {column.resizable !== false && index < columns.length - 1 && (
                    <div
                      className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-500 hover:w-1.5 transition-all duration-150"
                      onMouseDown={(e) => handleMouseDown(e, column.key)}
                      style={{
                        background:
                          isResizing === column.key ? "#3b82f6" : "transparent",
                      }}
                    />
                  )}
                </TableHeaderCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {isLoading
              ? Array.from({
                  length: pagination ? pagination.limit : rowsPerPage,
                }).map((_, rowIndex) => (
                  <TableRow
                    key={`skeleton-${rowIndex}`}
                    className="hover:bg-gray-50 skeleton-row"
                    style={{
                      animationDelay: `${rowIndex * 50}ms`,
                    }}
                  >
                    <TableCell
                      className={`py-3 px-4 ${
                        rowIndex <
                        (pagination ? pagination.limit : rowsPerPage) - 1
                          ? "border-b border-b-subprimary"
                          : ""
                      }`}
                      style={{ width: "40px", minWidth: "40px" }}
                    >
                      <Skeleton className="h-4 w-6 rounded" />
                    </TableCell>

                    {columns.map((column) => (
                      <TableCell
                        key={column.key}
                        className={`py-3 px-4 ${
                          rowIndex <
                          (pagination ? pagination.limit : rowsPerPage) - 1
                            ? "border-b border-b-subprimary"
                            : ""
                        }`}
                        style={{
                          width: `${columnWidths[column.key]}px`,
                          minWidth: `${columnWidths[column.key]}px`,
                          maxWidth: `${columnWidths[column.key]}px`,
                        }}
                      >
                        <Skeleton className="h-4 w-20 rounded" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : paginatedData.map((row, rowIndex) => (
                  <TableRow key={rowIndex} className="hover:bg-gray-50">
                    <TableCell
                      className={`py-3 px-4 !text-xs text-gray-500 font-mono ${
                        rowIndex < paginatedData.length - 1
                          ? "border-b border-b-subprimary"
                          : ""
                      }`}
                      style={{ width: "40px", minWidth: "40px" }}
                    >
                      {(paginationInfo.currentPage - 1) *
                        paginationInfo.itemsPerPage +
                        rowIndex +
                        1}
                    </TableCell>

                    {columns.map((column) => (
                      <TableCell
                        key={column.key}
                        className={`py-3 px-4 text-start font-normal text-ellipsis overflow-hidden ${
                          rowIndex < paginatedData.length - 1
                            ? "border-b border-b-subprimary"
                            : ""
                        }`}
                        style={{
                          width: `${columnWidths[column.key]}px`,
                          minWidth: `${columnWidths[column.key]}px`,
                          maxWidth: `${columnWidths[column.key]}px`,
                        }}
                        title={
                          typeof (row as Record<string, unknown>)[
                            column.key
                          ] === "string"
                            ? String((row as IRow)[column.key])
                            : ""
                        }
                      >
                        <span className="text-sm text-gray-500 block truncate">
                          {(row as IRowWithDisplay)._display &&
                          (row as IRowWithDisplay)._display?.[column.key]
                            ? (row as IRowWithDisplay)._display![column.key]
                            : (row as IRow)[column.key]}
                        </span>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
          </TableBody>
        </TremorTable>
      </div>

      {/* Empty state - show when no data but not loading */}
      {!isLoading && paginatedData.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-16 w-16 text-gray-400 mb-4">
            <svg
              className="h-full w-full"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">
            {t("table.noDataFound", { title: title || t("table.data") })}
          </h3>
        </div>
      )}

      {paginate && paginatedData.length > 0 && !isLoading && (
        <div className="flex items-center justify-between mt-4 py-4 px-4">
          {/* Left side - Showing X of Y items and rows per page selector */}
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              {t("table.showingItems", {
                start: Math.min(
                  (paginationInfo.currentPage - 1) *
                    paginationInfo.itemsPerPage +
                    1,
                  paginationInfo.totalItems
                ),
                end: Math.min(
                  paginationInfo.currentPage * paginationInfo.itemsPerPage,
                  paginationInfo.totalItems
                ),
                total: paginationInfo.totalItems,
              })}
            </div>

            {/* Rows per page selector */}
            {onRowsPerPageChange && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {t("table.show")}:
                </span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
                  className="text-sm border border-gray-300 rounded px-2 py-1 bg-white"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={30}>30</option>
                  <option value={40}>40</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-sm text-gray-600">
                  {t("table.perPage")}
                </span>
              </div>
            )}
          </div>

          {/* Right side - Pagination controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const newPage = Math.max(paginationInfo.currentPage - 1, 1);
                if (pagination && onPageChange) {
                  onPageChange(newPage);
                } else {
                  setCurrentPage(newPage);
                }
              }}
              disabled={paginationInfo.currentPage === 1}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent disabled:cursor-not-allowed cursor-pointer"
              title={t("table.previousPage")}
            >
              <Icon icon="heroicons:chevron-left" className="w-4 h-4" />
            </button>

            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {(() => {
                const pages = [];
                const maxVisiblePages = 7;

                if (paginationInfo.totalPages <= maxVisiblePages) {
                  for (let i = 1; i <= paginationInfo.totalPages; i++) {
                    pages.push(
                      <button
                        key={i}
                        onClick={() => {
                          if (pagination && onPageChange) {
                            onPageChange(i);
                          } else {
                            setCurrentPage(i);
                          }
                        }}
                        className={`w-8 h-8 rounded-md text-sm font-medium transition-colors flex items-center justify-center cursor-pointer ${
                          paginationInfo.currentPage === i
                            ? "bg-darkBlue text-white"
                            : "hover:bg-gray-100 text-gray-700"
                        }`}
                      >
                        {i}
                      </button>
                    );
                  }
                } else {
                  pages.push(
                    <button
                      key={1}
                      onClick={() => {
                        if (pagination && onPageChange) {
                          onPageChange(1);
                        } else {
                          setCurrentPage(1);
                        }
                      }}
                      className={`w-8 h-8 rounded-md text-sm font-medium transition-colors flex items-center justify-center cursor-pointer ${
                        paginationInfo.currentPage === 1
                          ? "bg-darkBlue text-white"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      1
                    </button>
                  );

                  if (paginationInfo.currentPage > 3) {
                    pages.push(
                      <span key="ellipsis1" className="px-2 text-gray-500">
                        ...
                      </span>
                    );
                  }

                  const start = Math.max(2, paginationInfo.currentPage - 1);
                  const end = Math.min(
                    paginationInfo.totalPages - 1,
                    paginationInfo.currentPage + 1
                  );

                  for (let i = start; i <= end; i++) {
                    if (i > 1 && i < paginationInfo.totalPages) {
                      pages.push(
                        <button
                          key={i}
                          onClick={() => {
                            if (pagination && onPageChange) {
                              onPageChange(i);
                            } else {
                              setCurrentPage(i);
                            }
                          }}
                          className={`w-8 h-8 rounded-md text-sm font-medium transition-colors flex items-center justify-center cursor-pointer ${
                            paginationInfo.currentPage === i
                              ? "bg-darkBlue text-white"
                              : "hover:bg-gray-100 text-gray-700"
                          }`}
                        >
                          {i}
                        </button>
                      );
                    }
                  }

                  if (
                    paginationInfo.currentPage <
                    paginationInfo.totalPages - 2
                  ) {
                    pages.push(
                      <span key="ellipsis2" className="px-2 text-gray-500">
                        ...
                      </span>
                    );
                  }

                  if (paginationInfo.totalPages > 1) {
                    pages.push(
                      <button
                        key={paginationInfo.totalPages}
                        onClick={() => {
                          if (pagination && onPageChange) {
                            onPageChange(paginationInfo.totalPages);
                          } else {
                            setCurrentPage(paginationInfo.totalPages);
                          }
                        }}
                        className={`w-8 h-8 rounded-md text-sm font-medium transition-colors flex items-center justify-center cursor-pointer ${
                          paginationInfo.currentPage ===
                          paginationInfo.totalPages
                            ? "bg-darkBlue text-white"
                            : "hover:bg-gray-100 text-gray-700"
                        }`}
                      >
                        {paginationInfo.totalPages}
                      </button>
                    );
                  }
                }

                return pages;
              })()}
            </div>

            <button
              onClick={() => {
                const newPage = Math.min(
                  paginationInfo.currentPage + 1,
                  paginationInfo.totalPages
                );
                if (pagination && onPageChange) {
                  onPageChange(newPage);
                } else {
                  setCurrentPage(newPage);
                }
              }}
              disabled={
                paginationInfo.currentPage === paginationInfo.totalPages
              }
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent disabled:cursor-not-allowed cursor-pointer"
              title={t("table.nextPage")}
            >
              <Icon icon="heroicons:chevron-right" className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}