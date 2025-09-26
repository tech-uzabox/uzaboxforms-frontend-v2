import { cn } from "@/lib/utils";
import { useState } from "react";
import { Icon } from "@iconify/react";
import type { TreeNodeProps } from "@/types";
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import PositionForm from "@/components/organization/position-form";
import { ChevronDown, ChevronRight, Edit, Trash, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCreatePosition, useUpdatePosition, useDeletePosition } from "@/hooks/organization";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export const TreeNode = ({ node, level }: TreeNodeProps) => {
    const { mutate: updatePosition } = useUpdatePosition();
    const { mutate: deletePosition } = useDeletePosition();
    const { mutate: createPosition } = useCreatePosition();
    const { t } = useTranslation();

    const [isExpanded, setIsExpanded] = useState(false);
    const hasChildren = node.subordinates && Array.isArray(node.subordinates) && node.subordinates.length > 0;

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const handleEdit = (data: { userId: string; title: string }) => {
        updatePosition({
            id: node.id,
            formData: {
                ...data,
                superiorId: node.superiorId,
            },
        });
        setEditDialogOpen(false);
    };

    const handleAdd = (data: { userId: string; title: string }) => {
        createPosition({
            ...data,
            superiorId: node.id,
        });
        setAddDialogOpen(false);
    };

    const handleDelete = () => {
        deletePosition(node.id);
        setDeleteDialogOpen(false);
    };

    return (
        <div className="relative">
            <div
                className={cn(
                    "flex items-center p-3 mb-2 rounded-md border transition-colors group",
                    "hover:bg-slate-50/80 dark:hover:bg-slate-800/30",
                    level === 0 ? "bg-blue-50/60 dark:bg-blue-900/20 border-blue-200/40 dark:border-blue-700/30" : "bg-slate-50/40 dark:bg-slate-800/20 border-slate-200/30 dark:border-slate-700/20",
                )}
            >
                <div
                    className="mr-2 h-5 w-5 flex items-center justify-center rounded-sm hover:bg-muted cursor-pointer"
                    onClick={() => hasChildren && setIsExpanded(!isExpanded)}
                >
                    {hasChildren && (isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
                </div>

                <div className="flex items-center gap-3 flex-1">
                    <div className="bg-slate-100/60 dark:bg-slate-700/30 h-10 w-10 rounded-full flex items-center justify-center">
                        <Avatar className="w-12 h-12">
                            <AvatarImage 
                                src={node.user?.photo ? `/api/uploads/${node.user.photo}` : undefined} 
                                alt={`${node.user?.firstName || ''} ${node.user?.lastName || ''}`} 
                            />
                            <AvatarFallback className="text-base bg-slate-200/50 dark:bg-slate-600/30 text-slate-600 dark:text-slate-300">
                                {node.user?.firstName && node.user?.lastName 
                                    ? `${node.user.firstName[0]}${node.user.lastName[0]}` 
                                    : node.user?.email?.substring(0, 2).toUpperCase() || '??'}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <div>
                        <div className="flex items-center gap-5">
                            <div className="font-medium">
                                {node.user?.firstName || 'Unknown'} {node.user?.lastName || 'User'}
                            </div>
                            <div className="text-xs text-slate-600 dark:text-slate-300 bg-blue-100/70 dark:bg-blue-800/30 px-2 py-0.5 rounded">
                                {node.title}
                            </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                            {node.user?.email || 'No email'}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {node.roles?.map((role: any, index: number) => (
                                <div
                                    key={index}
                                    className="inline-flex items-center gap-1.5 bg-slate-100/60 dark:bg-slate-700/30 text-slate-600 dark:text-slate-300 text-xs p-1 rounded font-medium"
                                >
                                    <Icon icon="mdi:badge-account" className="" />
                                    <span>{role?.name || 'Unknown Role'}</span>
                                </div>
                            )) || []}
                        </div>
                    </div>
                </div>
                <div className="ml-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Plus size={16} />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{t('processManagement.addNewPosition')}</DialogTitle>
                                <DialogDescription>
                                    {t('processManagement.addNewPositionDescription')}
                                </DialogDescription>
                            </DialogHeader>
                            <PositionForm
                                initialData={{
                                    userId: "",
                                    title: "",
                                }}
                                onSubmit={handleAdd}
                                onCancel={() => setAddDialogOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                    <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Edit size={16} />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{t('processManagement.editPosition')}</DialogTitle>
                                <DialogDescription>
                                    {t('processManagement.editPositionDescription')}
                                </DialogDescription>
                            </DialogHeader>
                            <PositionForm
                                initialData={{
                                    userId: node.userId,
                                    title: node.title,
                                }}
                                onSubmit={handleEdit}
                                onCancel={() => setEditDialogOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                    <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => setDeleteDialogOpen(true)}
                        >
                            <Trash size={16} />
                        </Button>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>{t('processManagement.areYouSure')}</AlertDialogTitle>
                                <AlertDialogDescription>
                                    {t('processManagement.thisWillDeleteAndPotentiallyAffectReportingStructure')} 
                                    <strong className="text-black"> 
                                        {node.user?.firstName || 'Unknown'} {node.user?.lastName || 'User'} ({node.title}) 
                                    </strong>
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>{t('processManagement.cancel')}</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete} className="bg-red-500 text-white">
                                    {t('processManagement.delete')}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            {hasChildren && isExpanded && (
                <div className="pl-8 border-l ml-4 mt-2">
                    {node.subordinates?.map((child: any) => (
                        <TreeNode key={child?.id || Math.random()} node={child} level={level + 1} />
                    ))}
                </div>
            )}
        </div>
    );
};
