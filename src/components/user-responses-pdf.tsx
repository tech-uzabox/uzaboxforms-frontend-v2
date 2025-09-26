import { useEffect, useState } from "react";
import { parseISO, format, differenceInCalendarDays } from "date-fns";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// Define custom styles for the PDF
const styles = StyleSheet.create({
  page: {
    padding: 0,
    fontSize: 12,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
    flexDirection: "column",
  },
  content: {
    padding: "0px 40px",
    flexGrow: 1,
  },
  formHeader: {
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 20,
    marginTop: 10,
    color: "#1a1a1a",
    textAlign: "center",
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 12,
    color: "#1a1a1a",
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: 4,
  },
  question: {
    fontSize: 10,
    fontWeight: 600,
    marginBottom: 4,
    color: "#374151",
  },
  responseContainer: {
    marginBottom: 6,
  },
  responseText: {
    fontSize: 10,
    lineHeight: 1.6,
    color: "#4b5563",
    fontWeight: 400,
  },
  errorText: {
    fontSize: 12,
    marginBottom: 12,
    color: "#ef4444",
  },
  fileLink: {
    color: "#2563eb",
    textDecoration: "underline",
  },
  header: {
    width: "100%",
  },
  footer: {
    width: "100%",
  },
  pageNumber: {
    textAlign: "center",
    fontSize: 10,
    color: "#6b7280",
    marginVertical: 4,
  },
  headerImage: {
    width: "100%",
    // height: 80,
    objectFit: "cover",
    marginBottom: 20,
  },
  footerImage: {
    width: "100%",
    // height: 80,
    objectFit: "cover",
    marginTop: 20,
  },
  checkboxItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  checkboxSymbol: {
    marginRight: 8,
    fontSize: 12,
  },
  dateRangeText: {
    color: "#4b5563",
    fontSize: 12,
    marginTop: 2,
  },
  uploadedSignature: {
    maxWidth: 80,
    height: "auto",
    marginTop: 4,
  },
  uploadedImage: {
    maxWidth: 200,
    height: "auto",
    marginTop: 4,
  },
  calculationItem: {
    flexDirection: "row",
    marginBottom: 6,
    alignItems: "center",
  },
  calculationLabel: {
    width: "33%",
    fontSize: 10,
    fontWeight: 600,
    color: "#374151",
  },
  calculationValue: {
    flex: 1,
    fontSize: 10,
    color: "#4b5563",
    lineHeight: 1.6,
  },
});

const UserResponsesPDF = ({
  responses,
  allImages,
  showHeaderFooter = true,
}: {
  responses: any;
  allImages: any;
  showHeaderFooter?: boolean;
}) => {
  const [headerImage, setHeaderImage] = useState<string | null>(null);
  const [footerImage, setFooterImage] = useState<string | null>(null);

  useEffect(() => {
    
    if (allImages && showHeaderFooter) {
      
      // allImages is ImageData[] (array of ImageData objects)
      const header = allImages.find(
        (img: { type: string }) => img.type === "HEADER"
      );
      const footer = allImages.find(
        (img: { type: string }) => img.type === "FOOTER"
      );
      
      if (header) {
        setHeaderImage(header.fileUrl);
      }
      if (footer) {
        setFooterImage(footer.fileUrl);
      }
    } else {
      setHeaderImage(null);
      setFooterImage(null);
    }
  }, [allImages, showHeaderFooter]);

  const formatDate = (date: string) => {
    try {
      return format(parseISO(date), "MMMM d, yyyy");
    } catch {
      return "Invalid date";
    }
  };

  const getFileExtension = (filename: string) => {
    return filename.split(".").pop()?.toLowerCase() || "";
  };

  const renderResponse = (type: string, response: any) => {
    if (!type)
      return <Text style={styles.errorText}>Question type missing</Text>;

    switch (type) {
      case "Short Text":
      case "Email":
      case "Phone Number":
      case "Number":
      case "Paragraph":
      case "Dropdown":
        return (
          <Text style={styles.responseText}>{response || "Not provided"}</Text>
        );

      case "Date":
        return (
          <Text style={styles.responseText}>{formatDate(response.date)}</Text>
        );

      case "Time":
        return (
          <Text style={styles.responseText}>{response || "Not provided"}</Text>
        );

      case "DateTime":
        if (response?.date && response?.time) {
          return (
            <Text style={styles.responseText}>
              {formatDate(response.date)} at {response.time}
            </Text>
          );
        }
        return <Text style={styles.responseText}>Not provided</Text>;

      case "DateRange":
        if (response?.start && response?.end) {
          const startDate = formatDate(response.start);
          const endDate = formatDate(response.end);
          const totalDays =
            differenceInCalendarDays(
              parseISO(response.end),
              parseISO(response.start)
            ) + 1;

          return (
            <View>
              <Text style={styles.responseText}>
                {startDate} - {endDate}
              </Text>
              <Text style={styles.dateRangeText}>
                Duration: {totalDays > 0 ? totalDays : 0} days
              </Text>
            </View>
          );
        }
        return <Text style={styles.responseText}>Not provided</Text>;

      case "Checkbox":
        return response && Array.isArray(response) ? (
          <View>
            {response.map(
              (
                { option, checked }: { option: string; checked: boolean },
                index: number
              ) => (
                <View key={index} style={styles.checkboxItem}>
                  <Text style={styles.checkboxSymbol}>
                    {checked ? "☑" : "☐"}
                  </Text>
                  <Text style={styles.responseText}>{option}</Text>
                </View>
              )
            )}
          </View>
        ) : (
          <Text style={styles.responseText}>No options selected</Text>
        );

      case "Signature":
        return response ? (
          <Image
            src={`/api/uploads/${response}`}
            style={styles.uploadedSignature}
          />
        ) : (
          <Text style={styles.responseText}>No signature provided</Text>
        );

      case "Upload":
        if (response) {
          const fileExtension = getFileExtension(response);
          const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "svg"];

          if (imageExtensions.includes(fileExtension)) {
            return (
              <Image
                src={`/api/uploads/${response}`}
                style={styles.uploadedImage}
              />
            );
          }
          return <Text style={styles.fileLink}>{response}</Text>;
        }
        return <Text style={styles.responseText}>No file uploaded</Text>;

      case "Add Calculation":
        if (response?.calculations && Array.isArray(response.calculations)) {
          return (
            <View>
              {response.calculations.map(
                (calc: { name: string; result: number }, index: number) => (
                  <View key={index} style={styles.calculationItem}>
                    <Text style={styles.calculationLabel}>{calc.name}</Text>
                    <Text style={styles.calculationValue}>
                      {isNaN(calc.result) ? "Error" : calc.result.toFixed(2)}
                    </Text>
                  </View>
                )
              )}
            </View>
          );
        }
        return (
          <Text style={styles.responseText}>No calculations provided</Text>
        );

      default:
        return <Text style={styles.errorText}>Unsupported question type</Text>;
    }
  };

  if (!responses || !Array.isArray(responses)) {
    return (
      <Document>
        <Page style={styles.page}>
          <Text style={styles.errorText}>Invalid responses format</Text>
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      {responses.map((responseBlock: any, blockIndex: number) => (
        <Page key={blockIndex} style={styles.page}>
          {/* Header Image on every page */}
           {headerImage && (
             <View style={styles.header} fixed>
               <Image
                 src={headerImage}
                 style={styles.headerImage}
               />
             </View>
           )}

          {/* Main Content */}
          <View style={styles.content}>
            <Text style={styles.formHeader}>
              {responseBlock.formName || responseBlock.name || "Unnamed Form"}
            </Text>

            {/* Handle both old array format and new object format */}
            {(Array.isArray(responseBlock.responses)
              ? responseBlock.responses
              : Object.values(responseBlock.responses || {})
            )?.map((section: any, sectionIndex: number) => (
              <View
                key={`${blockIndex}-${sectionIndex}`}
                style={{ marginBottom: 12 }}
              >
                <Text style={styles.sectionHeader}>
                  {section.sectionName || "Unnamed Section"}
                </Text>

                {/* Handle both old array format and new object format for questions */}
                {(Array.isArray(section.responses)
                  ? section.responses
                  : Object.values(section.questions || section.responses || {})
                )?.map((question: any, questionIndex: number) => (
                  <View
                    key={`${blockIndex}-${sectionIndex}-${questionIndex}`}
                    style={styles.responseContainer}
                  >
                    <Text style={styles.question}>
                      {question.label || "Unnamed Question"}
                    </Text>
                    {renderResponse(question.questionType, question.response)}
                  </View>
                )) || (
                  <Text style={styles.responseText}>
                    No questions in this section
                  </Text>
                )}
              </View>
            )) || <Text style={styles.responseText}>No responses found</Text>}
          </View>

          {/* Footer and Pagination on every page */}
           {footerImage && (
             <View style={styles.footer} fixed>
               <Image
                 src={footerImage}
                 style={styles.footerImage}
               />
             </View>
           )}
        </Page>
      ))}
    </Document>
  );
};

export default UserResponsesPDF;
