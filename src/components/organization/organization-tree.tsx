import { TreeNode } from "./tree-node";
import type { Position } from "@/types";
import OrganizationErrorBoundary from "./organization-error-boundary";

interface OrganizationTreeProps {
  positions: Position[];
}

export const OrganizationTree = ({ positions }: OrganizationTreeProps) => {
  return (
    <div className="min-w-[48rem]">
      <OrganizationErrorBoundary>
        {positions.map((position) => (
          <TreeNode key={position?.id || Math.random()} node={position} level={0} />
        ))}
      </OrganizationErrorBoundary>
    </div>
  );
};
