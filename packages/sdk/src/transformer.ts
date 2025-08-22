import { Node, SourceFile, ts } from "ts-morph";
import { getFirstSiblingByKindOrThrow, iterateNodes } from "./ast";
import { isProcedure } from "./guard";

type Transformer = (node: Node) => Array<() => Node<ts.Node> | void>;

export const getAllTransformers = (
  files: SourceFile[],
  transformations: Array<[(node: Node) => boolean, Transformer]>,
) =>
  [...iterateNodes(files)].flatMap(([node]) =>
    transformations.flatMap(([predicate, transform]) =>
      predicate(node) ? transform(node) : [],
    ),
  );

export const redefine =
  (text: string): Transformer =>
  (node: Node) => {
    const sibling = getFirstSiblingByKindOrThrow(
      node,
      ts.SyntaxKind.SyntaxList,
    );
    return [() => sibling.replaceWithText(text)];
  };

type Mappers = Array<() => Node<ts.Node> | void>;
type RoutePredicate = (node: Node, path: string[]) => boolean;

// Default predicate that keeps all routes
const defaultPredicate: RoutePredicate = () => true;

function pruneRouterRecursive(
  node: Node, // this is the current node we're processing
  currentPath: string[] = [], // track the current path
  shouldKeep: RoutePredicate = defaultPredicate, // predicate to determine if a route should be kept
): Mappers {
  // Base case: If this is a route endpoint (procedure call)
  if (isProcedure(node)) {
    // Apply the predicate to determine if we should keep this route
    if (!shouldKeep(node, currentPath)) {
      // Prune this procedure
      return redefine("() => undefined as any")(node);
    }

    // Keep this procedure intact
    return [];
  }

  // Recursive case: Process all children and collect transformations
  const mappings: Mappers = [];

  // Handle object literal expressions (routers and subrouters)
  if (node.getKind() === ts.SyntaxKind.ObjectLiteralExpression) {
    node
      .getChildrenOfKind(ts.SyntaxKind.PropertyAssignment)
      .forEach((route) => {
        const [key, _, value] = route.getChildren();
        if (!key || !value) {
          throw new Error("Unexpected router structure");
        }

        // Get the name of this route from the key
        const routeName = key.getText().replace(/["'`]/g, "");
        const updatedPath = [...currentPath, routeName];

        // Process this child node recursively
        const childMappings = pruneRouterRecursive(
          value,
          updatedPath,
          shouldKeep,
        );
        mappings.push(...childMappings);
      });
  }

  // Handle call expressions
  if (node.getKind() === ts.SyntaxKind.CallExpression) {
    // Process all descendants of this call expression
    node.getDescendants().forEach((descendant) => {
      const descendantMappings = pruneRouterRecursive(
        descendant,
        currentPath,
        shouldKeep,
      );
      mappings.push(...descendantMappings);
    });
  }

  // For any other node type, process all children recursively
  if (
    ![
      ts.SyntaxKind.ObjectLiteralExpression,
      ts.SyntaxKind.CallExpression,
    ].includes(node.getKind())
  ) {
    node.getChildren().forEach((child) => {
      const childMappings = pruneRouterRecursive(
        child,
        currentPath,
        shouldKeep,
      );
      mappings.push(...childMappings);
    });
  }

  return mappings;
}

export const pruneRouter =
  (predicate?: RoutePredicate): Transformer =>
  (node: Node) => {
    const expr = node
      .getParentOrThrow()
      .getFirstDescendantByKindOrThrow(ts.SyntaxKind.ObjectLiteralExpression);

    return pruneRouterRecursive(expr, [], predicate);
  };
