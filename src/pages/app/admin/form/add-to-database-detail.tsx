import { toast } from 'sonner';
import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ItemTypes, LevelTypes } from '@/types';
import { useUpdateAddToDatabase, useGetAddToDatabaseById } from '@/hooks';

const AddToDatabaseDetail = () => {
    const params = useParams()
    const { t } = useTranslation();
    const id = params.id as string
    const { data, isLoading } = useGetAddToDatabaseById(id)
    const [levels, setLevels] = useState<LevelTypes[]>([]);
    const updateDatabaseMutation = useUpdateAddToDatabase();

    useEffect(() => {
        if (data && data.levels) {
            setLevels(data.levels)
        }
    }, [data])

    if (isLoading) {
        return (
            <p className='text-center py-5'>{t('processManagement.fetchingFromDatabase')}</p>
        )
    }

    const handleLevelNameChange = (index: number, value: string) => {
        const updatedLevels = [...levels];
        updatedLevels[index] = { ...updatedLevels[index], levelName: value };
        setLevels(updatedLevels);
    };

    const handleItemNameChange = (levelIndex: number, itemIndex: number, value: string) => {
        const updatedLevels = [...levels];
        updatedLevels[levelIndex].items[itemIndex] = { ...updatedLevels[levelIndex].items[itemIndex], itemName: value };
        setLevels(updatedLevels);
    };

    const handleAddLevel = () => {
        const newLevel: LevelTypes = {
            levelId: `level-${Date.now()}`,
            levelName: '',
            items: []
        };
        const updatedLevels = [...levels, newLevel];
        setLevels(updatedLevels);
    };

    const handleAddItem = (levelIndex: number) => {
        const newItem: ItemTypes = {
            itemId: `item-${Date.now()}`,
            itemName: '',
            parentItemId: ''
        };
        const updatedLevels = [...levels];
        updatedLevels[levelIndex].items.push(newItem);
        setLevels(updatedLevels);
    };

    const handleRemoveLevel = (index: number) => {
        const updatedLevels = [...levels];
        updatedLevels.splice(index, 1);
        updatedLevels.forEach(level => {
            level.items.forEach(item => {
                if (item.parentItemId === levels[index].levelId) {
                    item.parentItemId = '';
                }
            });
        });
        setLevels(updatedLevels);
    };

    const handleRemoveItem = (levelIndex: number, itemIndex: number) => {
        const updatedLevels = [...levels];
        const removedItemId = updatedLevels[levelIndex].items[itemIndex].itemId;
        updatedLevels[levelIndex].items.splice(itemIndex, 1);
        updatedLevels.forEach(level => {
            level.items.forEach(item => {
                if (item.parentItemId === removedItemId) {
                    item.parentItemId = '';
                }
            });
        });
        setLevels(updatedLevels);
    };

    const handleItemParentChange = (levelIndex: number, itemIndex: number, value: string) => {
        const updatedLevels = [...levels];
        updatedLevels[levelIndex].items[itemIndex] = { ...updatedLevels[levelIndex].items[itemIndex], parentItemId: value };
        setLevels(updatedLevels);
    };

    const handleUpdate = async () => {
        try {
            const response = await updateDatabaseMutation.mutateAsync({ id, data: { levels } });
            if (response) {
                toast.success(t('common.databaseItemUpdatedSuccessfully'));
            } else {
                toast.error(t('common.operationFailed'));
            }
        } catch (error) {
            console.error(error);
            toast.error(t('processManagement.failedToUpdate'));
        }
    };

    return (
        <div className="space-y-4 max-w-screen-md mx-auto">
            <p className='text-lg font-medium text-black text-center py-3'>{data.name}</p>
            {levels.map((level, levelIndex) => (
                <div key={level.levelId} className="p-3 bg-white border-l-[2.4px] border-white focus-within:border-darkBlue rounded-md space-y-3">
                    <div className="flex space-x-4 items-center">
                        <label className="main-label">{t('processManagement.levelName')}</label>
                        <input
                            type="text"
                            value={level.levelName}
                            onChange={(e) => handleLevelNameChange(levelIndex, e.target.value)}
                            className="main-input"
                            placeholder={t('processManagement.levelNamePlaceholder', { index: levelIndex + 1 })}
                        />
                        <button
                            type="button"
                            onClick={() => handleRemoveLevel(levelIndex)}
                            className="text-red-500 text-2xl"
                        >
                            <Icon icon="ic:outline-delete" />
                        </button>
                    </div>
                    {level.items.map((item, itemIndex) => (
                        <div key={item.itemId} className="flex space-x-4 items-center">
                            <input
                                type="text"
                                value={item.itemName}
                                onChange={(e) => handleItemNameChange(levelIndex, itemIndex, e.target.value)}
                                className="main-input"
                                placeholder={t('processManagement.itemNamePlaceholder', { index: itemIndex + 1 })}
                            />
                            {levelIndex > 0 && (
                                <select
                                    value={item.parentItemId}
                                    onChange={(e) => handleItemParentChange(levelIndex, itemIndex, e.target.value)}
                                    className="main-input"
                                >
                                    <option value="">{t('processManagement.selectParentItem')}</option>
                                    {levels[levelIndex - 1].items.map((parentItem) => (
                                        <option key={parentItem.itemId} value={parentItem.itemId}>
                                            {parentItem.itemName}
                                        </option>
                                    ))}
                                </select>
                            )}
                            <button
                                type="button"
                                onClick={() => handleRemoveItem(levelIndex, itemIndex)}
                                className="text-red-500"
                            >
                                X
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => handleAddItem(levelIndex)}
                        className="flex justify-between border-none hover:bg-inherit text-darkBlue items-center space-x-1 p-0"
                    >
                        <Icon icon={"gg:add"} fontSize={21} />
                        <p>
                            {t('processManagement.addItem')}
                        </p>
                    </button>
                </div>
            ))}
            <div className='flex justify-between items-center'>
                <button
                    type="button"
                    onClick={handleAddLevel}
                    className="main-dark-button"
                >
                    {t('processManagement.addLevel')}
                </button>
                <button
                    type="button"
                    onClick={handleUpdate}
                    className="main-dark-button"
                >
                    {updateDatabaseMutation.isPending ? t('processManagement.updating') : t('processManagement.updateAddToDatabase')}
                </button>
            </div>
        </div>
    );
};

export default AddToDatabaseDetail;