import ast
import unittest

def optimize(node):
    # simplify sub-expressions involving only integers
    def traverse(body):
        # if its a variable or a constant, return it
        if not isinstance(body, ast.BinOp): return body;
        body.left = traverse(body.left)
        body.right = traverse(body.right)

        # if they're both constants, fold them
        if isinstance(body.left, ast.Constant) and isinstance(body.right, ast.Constant):
            if isinstance(body.op, ast.Add): return ast.Constant(body.left.value + body.right.value)
            if isinstance(body.op, ast.Sub): return ast.Constant(body.left.value - body.right.value)
            if isinstance(body.op, ast.Mult): return ast.Constant(body.left.value * body.right.value)

        return body

    node.body = traverse(node.body)

    return node

class TestOptimize(unittest.TestCase):
    def test_optimize(self):
        test_cases = [
            ('1 + 2 * 3', '7'),
            ('x + 1', 'x + 1'),
            ('(2 + 3) * x + y * (z + (2 - 1) * 3)', '5 * x + y * (z + 3)'),
        ]
        for s, expected in test_cases:
            expr = ast.parse(s, mode='eval')
            # Uncomment to print AST for expression
            # print(ast.dump(expr, indent=2))
            optimized = optimize(expr)
            actual = ast.unparse(optimized)
            if actual != expected:
                raise AssertionError(f'"{s}": expected "{expected}", got "{actual}"')

if __name__ == '__main__':
    unittest.main()
