import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { roleStore, groupStore } from '@/store'
import { useGetAllRoles } from '@/hooks/user/use-role'
import GroupTable from '@/components/groups/group-table'
import { useGetAllGroups } from '@/hooks/user/use-group'

const Group = () => {
  const { setGroups } = groupStore();
  const { t } = useTranslation();
  const { setRoles } = roleStore()
  const { data, isPending } = useGetAllGroups();
  const { data: roleData } = useGetAllRoles();

  useEffect(() => {
      setGroups(data);
      if (roleData) setRoles(roleData)
  }, [data, roleData]);

  return (
    <div className=" space-y-6">
      
      <h1 className="text-2xl font-semibold text-center">{t('groupManagement.groups')} </h1>
      {isPending ? (
        <p className="h-full flex justify-center items-center">{t('processManagement.fetchingGroups')}</p>
      ) : (
          <GroupTable />
      )}
    </div>
  )
}

export default Group