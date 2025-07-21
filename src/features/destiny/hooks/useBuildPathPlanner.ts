import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild';
import { useDestinyPath } from './useDestinyPath';
import type { DestinyNode } from '../types';

export function useBuildPathPlanner(destinyNodes: DestinyNode[]) {
  const { build, setDestinyPath } = useCharacterBuild();

  // Map build.destinyPath to DestinyNode objects
  const selectedDestinyPath: DestinyNode[] = build.destinyPath.length === 0
    ? []
    : build.destinyPath
      .map((id: string) => destinyNodes.find((n: DestinyNode) => n.id === id))
      .filter((n: DestinyNode | undefined): n is DestinyNode => !!n);

  // Destiny path planning logic: always use the current build path as the initialPath for predictive paths
  const {
    predictivePaths,
    isNodePlanned,
  } = useDestinyPath({
    nodes: destinyNodes,
    plannedNodes: [],
    onNodePlan: () => {},
    onNodeUnplan: () => {},
    initialPath: selectedDestinyPath,
  });

  // Filter predictivePaths to only show those that continue from the last node in the build path
  let filteredPredictivePaths = predictivePaths;
  if (selectedDestinyPath.length > 0) {
    const lastNode = selectedDestinyPath[selectedDestinyPath.length - 1];
    filteredPredictivePaths = predictivePaths.filter(
      path => path.path.length > 0 && path.path[0].id === lastNode.id
    );
  }

  // Handler to update build path when a user selects a path from possible paths
  const handleBuildPathSelect = (path: DestinyNode[], clickedIndex: number) => {
    const newPath = path.slice(0, clickedIndex + 1).map(n => n.id);
    setDestinyPath(newPath);
  };

  // Handler for clicking a node in the breadcrumb (Current Destiny tab)
  const handleBreadcrumbClick = (index: number) => {
    const newPath = selectedDestinyPath.slice(0, index + 1).map(n => n.id);
    setDestinyPath(newPath);
  };

  return {
    build,
    selectedDestinyPath,
    filteredPredictivePaths,
    isNodePlanned,
    handleBuildPathSelect,
    handleBreadcrumbClick,
    setDestinyPath,
  };
} 