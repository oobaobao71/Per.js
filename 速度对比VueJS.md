### Per.js速度对比Vue.js
首先，我要承诺，尽管我是Per.js的作者，但是我在这次测试中完全保持公平公正的原则，不对测试结果有一点改动。<br>
<br>
由于Vue.js和Per.js的功能巨多，所以无法测试全部功能，我就在这次测试里先测试2个有代表性的功能，分别为：for和component。<br>
<br>
同时，为了避免纠纷，现在我就先简单介绍一下具体的参数：
- 测试电脑为macbook air 2015 13英寸款，mac os版本号为10.11.6 (15G31)
- 测试浏览器为google chrome（52.0.2743.116 (64-bit)版）和firefox（61.0.2 (64 位)）
- 测试Vue.js版本为2.5.17
- 测试Per.js版本为1.3
<br>
现在让我们先开始测试for指令：（效果：浏览器ul标签输出20000条数据）
<br>
【以下是Vue.js代码】

```html
<!DOCTYPE html>
<html>
    <head>
        <title>SPEED TEST</title>
        <meta charset="UTF-8">
    </head>
    <body>
        <ul id="v-for-object" class="demo">
          <li v-for="value in object">
            {{ value }}
          </li>
        </ul>
        <script src="https://cdn.jsdelivr.net/npm/vue@2.5.17/dist/vue.js"></script>
        <script src="Per.js"></script>
        <script>
            var arr = new Array();
            for(var i=0;i<=20000;i++){
                arr[arr.length] = i;
            }
            //请看清console.time语句位置！避免产生不必要纠纷
            console.time("Vue.js time");
            new Vue({
              el: '#v-for-object',
              data: {
                object: arr
              }
            });
            console.timeEnd("Vue.js time");
        </script>
    </body>
</html>
```

 **执行时间具体说明：** <br>
经过测试，在chrome浏览器中，第一次Vue的执行时间大约为220ms，之后每次的执行时间在160到202ms之间。在firefox浏览器中，第一次的执行时间为213ms，之后每次的测试时间在158到182ms之间。<br>
接下来我们来看看Per.js的执行时间<br>
【以下是Per.js代码】

```html
<!DOCTYPE html>
<html>
    <head>
        <title>SPEED TEST</title>
        <meta charset="UTF-8">
    </head>
    <body>
        <ul id="v-for-object" class="demo">
        </ul>
        <script src="https://cdn.jsdelivr.net/npm/vue@2.5.17/dist/vue.js"></script>
        <script src="Per.js"></script>
        <script>
            var arr = new Array();
            for(var i=0;i<=20000;i++){
                arr[arr.length] = i;
            }
            arr[arr.length] = "";
            //请看清console.time语句位置！避免产生不必要纠纷
            console.time("Per.js time");
            Per().do({
                el: "#v-for-object",
                for: arr
            });
            console.timeEnd("Per.js time");
        </script>
    </body>
</html>
```

 **执行时间具体说明：** <br>
经过测试，Per.js在chrome浏览器里的第一次的执行时间大约为46.5ms，之后每次的执行时间在38到41ms之间。在firefox浏览器里，Per.js的第一次执行时间为39ms，之后每次的执行时间在36到39ms之间。
### 结论：
由此可以得出，在google chrome浏览器中，Per.js在“使用for指令输出20000条信息”的测试中，比Vue.js速度快大约5倍。在firefox浏览器中，Per.js的速度比Vue.js的速度快大约4.5倍。
<br>
<hr>
接下来，我们来测试组件的注册与绘制。<br>
以下代码使用组件功能在100个元素中间绘制组件。<br>
【以下是Vue.js代码】

```html
<!DOCTYPE html>
<html>
    <head>
        <title>SPEED TEST</title>
        <meta charset="UTF-8">
    </head>
    <body id="body">
        <div id='components-demo'></div>
        <script src="https://cdn.jsdelivr.net/npm/vue@2.5.17/dist/vue.js"></script>
        <script src="Per.js"></script>
        <script>
            for(var i=0;i<=100;i++){
                document.getElementById("components-demo").innerHTML += "<button-counter></button-counter>";
            }
            console.time("Vue.js time");
            Vue.component('button-counter', {
              data: function () {
                return {
                  count: 0
                }
              },
              template: '<h1>Hello World</h1>'
            });
            new Vue({ el: '#components-demo' });
            console.timeEnd("Vue.js time");
        </script>
    </body>
</html>
```

 **执行时间具体说明：** <br>
经过测试，在chrome浏览器中，第一次Vue的执行时间大约为67ms，之后每次的执行时间在51到70ms之间。在firefox浏览器中，第一次的执行时间为106ms，之后每次的测试时间在78到87ms之间。<br>
下面我们来测试Per.js的性能。<br>
【以下是Per.js代码】

```html
<!DOCTYPE html>
<html>
    <head>
        <title>SPEED TEST</title>
        <meta charset="UTF-8">
    </head>
    <body id="body">
        <script src="https://cdn.jsdelivr.net/npm/vue@2.5.17/dist/vue.js"></script>
        <script src="Per.js"></script>
        <script>
            for(var i=0;i<=100;i++){
                document.getElementById("body").innerHTML += "<button-counter></button-counter>";
            }
            console.time("Per.js time");
            Per().use("Per.component");
            Per().component().set("button-counter","<h1>Hello World</h1>");
            Per().component().apply("button-counter");
            console.timeEnd("Per.js time");
        </script>
    </body>
</html>
```

 **执行时间具体说明：** <br>
令人及其惊奇的是（包括我），Per.js在chrome浏览器里的第一次的执行时间居然大约只有1.5ms，之后每次的执行时间在1.2到1.4ms之间。在firefox浏览器里，Per.js的第一次执行时间为2ms，之后每次的执行时间在2到3ms之间。<br>
### 结论：
由此可以得出，在google chrome浏览器中，Per.js在“注册组件并在100的元素中渲染组件”的测试中，比Vue.js速度快大约45倍。在firefox浏览器中，Per.js的速度比Vue.js的速度快大约30倍。
<br>
<hr>
大家都知道数据模板是使用Vue时最常用的功能，那么接下来，我们就来数据模板的绘制。<br>
以下代码使用数据模板功能在100个元素中间分别绘制2个变量。<br>
【以下代码使用Vue2.5.17版本和Per.js2.0版本进行操作】<br>
【由于Per.js和Vue都只支持单元素操作，所以这里会重复执行Per和Vue的构造方法，相当于还比的是构造方法创建的速度】<br>
【以下是Vue.js代码】

```html
<!DOCTYPE html>
<html>
    <head>
        <title>SPEED TEST</title>
        <meta charset="UTF-8">
    </head>
    <body id="body">
        <div id='data-demo'></div>
        <script src="https://cdn.jsdelivr.net/npm/vue@2.5.17/dist/vue.js"></script>
        <script src="http://per-js.skyogo.com/2.0/Per.js"></script>
        <script>
            for(var i=0;i<=100;i++){
                document.getElementById("data-demo").innerHTML += "<p id='p"+i+"'>{{var1}}{{var2}}</p>";
            }
            console.time("Vue.js time");
            for(var i=0;i<=100;i++){
                new Vue({
                    el: '#p'+i,
                    data: {
                        var1: "Hello",
                        var2: "World"
                    }
                })
            }
            console.timeEnd("Vue.js time");
        </script>
    </body>
</html>
```

 **执行时间具体说明：** <br>
经过测试，在chrome浏览器中，第一次Vue的执行时间大约为58ms，之后每次的执行时间在48到53ms之间。在firefox浏览器中，第一次的执行时间为143ms，之后每次的测试时间在148到137ms之间。<br>
下面我们来测试Per.js的性能。<br>
【以下是Per.js代码】

```html
<!DOCTYPE html>
<html>
    <head>
        <title>SPEED TEST</title>
        <meta charset="UTF-8">
    </head>
    <body id="body">
        <div id='data-demo'></div>
        <script src="https://cdn.jsdelivr.net/npm/vue@2.5.17/dist/vue.js"></script>
        <script src="http://per-js.skyogo.com/2.0/Per.js"></script>
        <script>
            for(var i=0;i<=100;i++){
                document.getElementById("data-demo").innerHTML += "<p id='p"+i+"'>{{var1}}{{var2}}</p>";
            }
            console.time("Per.js time");
            for(var i=0;i<=100;i++){
                Per().do({
                    el: '#p'+i,
                    data: {
                        var1: "Hello",
                        var2: "World"
                    }
                });
            }
            console.timeEnd("Per.js time");
        </script>
    </body>
</html>
```

 **执行时间具体说明：** <br>
Per.js在chrome浏览器里的第一次的执行时间大约只有16ms，之后每次的执行时间在16到21ms之间。在firefox浏览器里，Per.js的第一次执行时间为62ms，之后每次的执行时间在54到63ms之间。<br>
### 结论：
由此可以得出，在google chrome浏览器中，Per.js在“渲染数据模板”的测试中，比Vue.js速度快大约3.5倍。在firefox浏览器中，Per.js的速度比Vue.js的速度快出大约2.3倍。
<br>
<hr>
这就是最后的结果，说实话，我也没想到Per.js会如此之快，如果各位在测试里面找到了一些小问题，欢迎私信我，我会重新修改问题并测试的。<br>
也希望那些钟爱Vue.js的人们，不要老是喷我们的作品，我们并没有恶意，测试结果摆在这里。谢谢！