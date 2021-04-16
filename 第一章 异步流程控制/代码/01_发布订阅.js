var fs = require('fs');

const school = {};

const Dep = {
    arr: [],
    on(fn) {
        this.arr.push(fn);
    },
    emit() {
        if (Object.keys(school).length === 3) {
            this.arr.forEach(function (item) {
                item();
            })
        }
    }
}

Dep.on(function () {
    console.log(school);
})

Dep.on(function () {
    console.log('读取结束了');
})

fs.readFile('./address.txt', 'utf8', function (err, res) {
    console.log(err);
    school.address = res;
    Dep.emit();
})

fs.readFile('./age.txt', 'utf8', function (err, res) {
    school.age = res;
    Dep.emit();
})

fs.readFile('./address.txt', 'utf8', function (err, res) {
    school.name = res;
    Dep.emit();
})
