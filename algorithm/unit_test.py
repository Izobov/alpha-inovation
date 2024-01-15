import unittest
from solve import solve

class TestSolve(unittest.TestCase):
    def test_solve(self):
        self.assertCountEqual(solve(["ab", "bc", "cd"], "abcd"), ["ab", "cd"])
        self.assertCountEqual(solve(["ab", "bc", "cd"], "cdab"), ["cd", "ab"])
        self.assertEqual(solve(["ab", "bc", "cd"], "abab"), "None")
        self.assertCountEqual(solve(["ab", "bc", "ab"], "abab"), ["ab", "ab"])
        self.assertEqual(solve(["Ab", "bc", "ab"], "abab"), "None")

if __name__ == '__main__':
    unittest.main()