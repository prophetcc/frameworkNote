let likeArray = {
    0: 1, 1: 2, 2: 3, length: 3, [Symbol.iterator]() {
        let index = 0;
        let that = this;
        return {
            new() {
                return {
                    done: index === that.length,
                    value: that[index++]
                }
            }
        }
    }
};

const arr = [...likeArray];

console.log(arr);