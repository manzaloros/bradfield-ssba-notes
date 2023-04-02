from collections import defaultdict
from operator import add, sub, mul

import ast
import unittest

X_REGISTER = 'r1'
Y_REGISTER = 'r2'

# Question: are we supposed to constant fold, here?

# Post order traversal?

def fold(body, leftVal, rightVal):
    if isinstance(body.op, ast.Add):
        return leftVal + rightVal
    if isinstance(body.op, ast.Sub):
       return leftVal - rightVal
    if isinstance(body.op, ast.Mult):
      return leftVal * rightVal

def getOp(body):
    if isinstance(body.op, ast.Add):
          return 'ADD'
    if isinstance(body.op, ast.Sub):
          return 'SUB'
    if isinstance(body.op, ast.Mult):
          return 'MUL'

# Time: O(number of nodes), Space: O(number of nodes)
def codegen(expr):
    instructions = []
    lastUsedTempRegister = 2 # track temp registers we can store intermediate results in, starts at register that holds y, since that's the most recently used register

    # post order traverse the AST. Always return the most recently used register
    # that includes accumulated values. Each invocation of traverse() pushes an
    # instruction to the instruction list.
    def traverse(body):
        nonlocal lastUsedTempRegister
        currentInstruction = ''

        if isinstance(body, ast.Name):
            lastUsedTempRegister += 1
            r = X_REGISTER if body.id == 'x' else Y_REGISTER
            currentInstruction = f'MOV %{r} %r{lastUsedTempRegister}'

        elif isinstance(body, ast.Constant): return f'${body.value}'

        # if both children are constants, fold them
        elif isinstance(body.left, ast.Constant) and isinstance(body.right, ast.Constant):
            lastUsedTempRegister += 1
            currentInstruction = f"MOV ${fold(body, body.left.value, body.right.value)} %r{lastUsedTempRegister}"
        elif isinstance(body, ast.BinOp):
            currentInstruction += f'{getOp(body)} {traverse(body.left)} {traverse(body.right)} %r{lastUsedTempRegister + 1}'

            lastUsedTempRegister += 1 # don't need this line if we're allowed to store results in the same register

        instructions.append(currentInstruction)
        return f'%r{lastUsedTempRegister}'

    traverse(expr.body) # returns last used temp register, but that's also stored in local var

    instructions.append(f'MOV %r{lastUsedTempRegister} %r0'); # move accumulated results to output register
    return instructions

OP_TO_FUNCTION = {
    'ADD': add,
    'SUB': sub,
    'MUL': mul,
}

def run_assembly_program(instructions, x, y):
    registers = defaultdict(int)
    registers[X_REGISTER] = x
    registers[Y_REGISTER] = y
    def input_operand(arg):
        if arg[0] == '$':
            return int(arg[1:])
        elif arg[0] == '%':
            if arg[1] != 'r' or not arg[2:].isdigit():
                raise ValueError(f'invalid register {arg}')
            return registers[arg[1:]]
        else:
            raise ValueError(f'invalid input operand {arg}')
    def output_operand(arg):
        if arg[0] != '%':
            raise ValueError(f'invalid output operand {arg}')
        return arg[1:]
    for instruction in instructions:
        parts = instruction.strip().split()
        if parts[0] == 'MOV':
            in1 = input_operand(parts[1])
            out1 = output_operand(parts[2])
            registers[out1] = in1
        elif parts[0] in OP_TO_FUNCTION:
            f = OP_TO_FUNCTION[parts[0]]
            in1 = input_operand(parts[1])
            in2 = input_operand(parts[2])
            out1 = output_operand(parts[3])
            registers[out1] = f(in1, in2)
        else:
            raise ValueError(f'invalid instruction {instruction}')
    return registers['r0']

class TestCodegen(unittest.TestCase):
    def test_codegen(self):
        # For each test case, generate assembly, then run it to make sure
        # it produces the expected answer.
        test_cases = [
            ('1 + 1', (0, 0), 2),
            ('1 + 2 * 3', (0, 0), 7),
            ('1 + 2 * (3 - 4)', (0, 0), -1),
            ('1 + (2 - 3) * 4 + 5', (0, 0), 2),
            ('x', (5, 4), 5),
            ('x + 1', (10, 0), 11),
            ('y + 1', (10, 0), 1),
            ('x + y + 1', (1, 2), 4),
            ('2 * ((x - 1) * (y + 2)) + x', (3, 5), 31),
        ]
        for s, (x, y), expected in test_cases:
            expr = ast.parse(s, mode='eval')
            # Uncomment to print AST for expression
            # print(ast.dump(expr, indent=2))
            program = codegen(expr)
            # Uncomment to print result of codegen
            # print(program)
            actual = run_assembly_program(program, x, y)
            if actual != expected:
                raise AssertionError(f'"{s}": expected "{expected}", got "{actual}"')

if __name__ == '__main__':
    unittest.main()
