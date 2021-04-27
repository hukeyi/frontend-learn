# freeCodeCamp

- mongodb and mongoose

## Mongoose

model- class，理解为类，里面包含了构造函数，构造函数包含了数据成员，类中还有成员函数
document- instance(construted from class)，理解为类的实例对象

schema- 理解为，类中定义对象的构造函数？
schema 中有 methods properties 相当于类的成员函数

创建一个 model 的过程：

### 首先定义一个 schema：

```
const kittySchema = new mongoose.Schema({
    name: String
})
```

使用 mongoose 提供的 Schema 构造函数创建新的 schema

### 给新创建的 kitten schema 增加函数成员

```
kittySchema.methods.speak = function(){
    console.log('meow)
}
```

### 根据 schema 创建 model

```
const Kitten = mongoose.model('Kitten', kittySchema);
```

至此，创建了一个叫 Kitten 的类，可以由这个类生成不同的实例对象

### 生成一个 Kitten 的实例对象 document

```
const mimi = new Kitten({name: 'mimi'});
```

以上，生成了一个叫 mimi 的猫，这个猫是 Kitten model 的其中一个 document，还没有加入 mongoDB 中

### 将 document 加入 mongodb 中

`Document.save(callback);`

```
mimi.save(function(err, mimi){
    if (err) return console.log(err);
    mimi.speak();
})
```

### 创建并保存实例对象在 Model 中

结合 4，5 步，在 model 中创建一个实例对象的完整过程为：

`const instance = new Model(obj).save(callback);`
其中 callback 函数接受两个参数，第一个为 err，第二个为创建成功的实例对象本身

这个完整过程可由`Model.create([obj]|obj, callback)`完成
如果第一个参数是 obj 的数组`[obj]`，那么 create 就对数组中对每一个 obj 执行 new Model(obj).save()操作
callback 传给 save()

### find 查询

查询当前 model 中的所有 document

```
Kitten.find(function(err, kittens){
    if (err) return console.log(err);
    console.log(kittens);
})
```

上面这个函数 [filter](https://mongoosejs.com/docs/tutorials/query_casting.html) 访问了 model 中所有的 document，如果想要精确搜索，那么：

find 的第一个参数就传入搜索条件，第二个参数如上设置 callback 函数：

```
Kitten.find({name: 'mimi'}, function(err, kitten){
    if (err) return console.log(err);
    console.log(kitten);
})
```

返回的结果将是数组。

无论匹配结果有多少个，都只返回一个结果，就用函数 findOne()

```
Kitten.findOne(filter, callback);
```

### update 数据

首先是老方法，不使用 mongoose 提供的 update 相关 api：

1. 用 findById 找到 document，
2. 在 find 函数的回调函数中，对回调函数提供的 document 直接进行 update 操作
3. update 操作完成后，执行 save，并在 save 的回调函数中执行 done()

```
const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";
  Person.findById(personId, function(err, person){
    if (err) return console.log(err);

    person.favoriteFoods.push(foodToAdd);
    person.save(function(err, updatedPerson){
      if (err) return console.log(err);
      done(null, updatedPerson);
    })
  })
};
```

然后是新方法，使用 mongoose 提供的 api：

注意点是，第三个参数要设置为`{new: true}`，否则回调函数提供的 doc 不是更新后的数据，而是更新前的旧数据

```
const findAndUpdate = (personName, done) => {
  const ageToSet = 20;

  Person.findOneAndUpdate({
    name: personName
  }, {age: ageToSet}, {new: true}, function(err, doc){
    if (err) return console.log(err);
    done(null, doc);
  })
};
```
