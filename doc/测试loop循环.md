### 代码：

```html
<!DOCTYPE html>
<html>
    <head>
        <title>Per.js Demo</title>
        <meta charset="UTF-8">
    </head>
    <body>
        <ul id="ul1" p-html p-loop-in="var1">
            <li>{{var1}}</li>
            <li>是否包含0：{{var1.indexOf('0')!=-1}}</li>
        </ul>
        <!-- a标签照样使用 -->
        <ul id="ul2" p-html p-loop-in="var1">
            <a title="{{var1}}" href="#">{{var1}}</li>
            <a href="#">传送门：{{var1}}</a>
        </ul>
        <script src="Per-zip.js"></script>
        <script>
            Per("#ul1").dom({
                loop: ["32132","124091","3221"]
            })
            Per("#ul2").dom({
                loop: ["百度","google"]
            })
        </script>
    </body>
</html>
```
效果：
![图](https://images.gitee.com/uploads/images/2018/0927/094749_09af9dc4_1687981.png "屏幕快照 2018-09-27 上午8.53.52.png")

结论：一切正常，a标签也能正常输出