## xlsx
npm install xlsx

在使用这个库之前，先介绍库中的一些概念。

- workbook 对象，指的是整份 Excel 文档。我们在使用 js-xlsx 读取 Excel 文档之后就会获得 workbook 对象。

- worksheet 对象，指的是 Excel 文档中的表。我们知道一份 Excel 文档中可以包含很多张表，而每张表对应的就是 worksheet 对象。

- cell 对象，指的就是 worksheet 中的单元格，一个单元格就是一个 cell 对象。

基本用法

- 用 XLSX.readFile 打开 Excel 文件，返回 workbook
- 用 workbook.SheetNames 获取表名
- 用 workbook.Sheets[xxx] 通过表名获取表格
- 按自己的需求去处理表格
- 生成新的 Excel 文件

- 前端直接使用

```js
var fileReader = new FileReader();
fileReader.onload = function(ev) {
  try {
    var data = ev.target.result,
    workbook = XLSX.read(data, {
        type: 'binary'
    }), // 以二进制流方式读取得到整份excel表格对象
    persons = []; // 存储获取到的数据
  } catch (e) {
    console.log('文件类型不正确');
    return;
  }
}
fileReader.readAsBinaryString(files[0]);
```