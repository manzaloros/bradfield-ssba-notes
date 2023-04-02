import ast
import unittest

def evaluate(node: ast.Expression):
    # inner function
    # if node is constant, return node.value
    # invoke operation(inner(left), inner(right))
    #

    # invoke inner(node.body)
    # is this in or Post order traversal?
    def inOrder(body: ast.BinOp):
        if (isinstance(body, ast.Constant)): return body.value

        left = inOrder(body.left)
        right = inOrder(body.right)
        if (isinstance(body.op,  ast.Add)): return left + right
        if (isinstance(body.op, ast.Sub)): return left - right
        if (isinstance(body.op, ast.Mult)): return left * right

    return inOrder(node.body)

class TestEvaluate(unittest.TestCase):
    def test_evaluate(self):
        test_cases = [
            ('1 + 1', 2),
            ('1 + 2 * 3', 7),
            ('1 + 2 * (3 - 4)', -1),
            ('1 + (2 - 3) * 4 + 5', 2),
        ]
        for s, expected in test_cases:
            expr = ast.parse(s, mode='eval')
            # Uncomment to print AST for expression
            # print(ast.dump(expr, indent=2))
            actual = evaluate(expr)
            if actual != expected:
                raise AssertionError(f'"{s}": expected {expected}, got {actual}')

if __name__ == '__main__':
    unittest.main()
