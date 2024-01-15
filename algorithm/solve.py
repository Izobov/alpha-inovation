def solve(word_list, target):
    rest = target
    result = []
    for word in word_list:
        if not rest:
            break
        if word in rest:
            result.append(word)
            rest = rest.replace(word, "", 1)

    if len(rest) > 0 or len(result) == 0:
        return "None"
    return result