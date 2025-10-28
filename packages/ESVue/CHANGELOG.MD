# CHANGELOG

## 20250627

### 新增：!important支持

### 新增：支持hippy3.0

### 新增：伪类选择器支持:not()

## 20250620

### 新增：伪类选择器支持：:first-child、:last-child、:only-child、:nth-child(n)、:empty

### 新增：尺寸支持auto

```css
.css-auto-width-css {
    width: auto;
    height: auto;
    flex-direction: column;
    align-items: center;
    background-color: #40b883;
}
```

### 新增：尺寸支持rem

```css
.css-rem-css {
    width: 960rem;
    height: 540rem;
    flex-direction: column;
    align-items: center;
    background-color: #40b883;
}
```

### 新增：directive v-pseudo:xxx 伪类控制指令

```text
 <div v-pseudo:abcd="true">

.div-v-pseudo-css:abcd {
  width: 384px;
  height: 216px;
  margin: 20px;
  background: palevioletred;
}
```

### 优化：HippyEvent中事件冒泡默认值修改为false，减少不必要的性能损耗。增加默认值开关。

```text
declare const __ES_VUE_FEATURE_FLAGS__: Partial<{
  ENABLE_KEY_EVENT_DISPATCH: boolean;          // 事件分发开关 @keydown="onKeyDown" @keyup="onKeyUp"
  ENABLE_EVENT_BUBBLE: boolean;                //事件冒泡开关
}>;
```

### 修复：css命名中特殊符号的处理

```css
.css-auto-img-\/css {
    width: 200px;
    height: 200px;
    flex-direction: column;
    align-items: center;
    background-color: #40b883;
}
```

### 新增：css变量 calc() / clamp() / min() / max() 表达式支持vw/vh

### 新增：尺寸支持vw/vh

```text
  "width",
  "height",
  "marginTop",
  "marginRight",
  "marginBottom",
  "marginLeft",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "top",
  "left",
  "right",
  "bottom",
  "fontSize",
  "lineHeight",
  "borderWidth",
  "borderRadius",
```

### 优化：patchStyle 的逻辑确实存在 无差别更新的问题

更新相同的样式依然会刷新更新刷新节点

### 新增：尺寸支持百分比

```text
  "width",
  "height",
  "top",
  "left",
  "right",
  "bottom",
  "marginTop",
  "marginLeft",
  "marginRight",
  "marginBottom",
  "paddingTop",
  "paddingLeft",
  "paddingRight",
  "paddingBottom",
```

### 优化：样式二级缓存

整体缓存策略总结图：

          +--------------------------------+
          |  getMatchedCssStyleWithCache() |
          |      ⬇ (已缓存)                |
          +--------------------------------+
                        ⬇
    +------------ getNativeStyles() ------------+
    |                                           |
    |     ⬇ 合并 + 伪类合并                    |
    |   mergedStyle = css + pseudo + inline    |
    |                                           |
    |     ⬇ resolveStyle(node, mergedStyle)    |
    |         - resolveRem                     |
    |         - resolvePercentStyles           |
    |                                           |
    |     ⬇ 缓存 __resolvedStyleCache         |
    +-------------------------------------------+

### 优化：伪类性能：

创建节点的时候假装匹配伪类，然后缓存伪类样式，事件触发的时候，直接使用缓存的伪类样式。

### 优化：更新节点性能：

创建节点时候缓存匹配的样式，更新节点的时候直接使用缓存样式，避免重新匹配样式。

### 新增：img标签如果不设置宽高，则默认显示图片实际的宽高

### 新增：路由堆栈上顶层页面上所有组件支持 @keydown="keydown" @keyup="keyup" 监听按键

## 20250613

### 新增：css选择器: 基础选择器、组合选择器、属性选择器、

### 新增：支持css伪类

### 新增：支持主题切换

### 新增：支持css变量

### 新增：gradientBackground 支持多种颜色值

### 新增：所有组件添加默认透明背景色

### 新增：图片标签添加默认宽高

### 新增：文本标签添加默认宽高

### 修复：background-image兼容性修改

以下这种多层背景格式支持，样式只支持`linear-gradient`

```css
.test {
    background-image: linear-gradient(to bottom, rgba(255, 255, 0, 0.5), rgba(0, 0, 255, 0.5)), url("cat-front.png");
}

```

### 新增：background属性支持：background-color和background-image

### 新增：border缩写属性支持，border: 4px solid #FFFFFF; 分别解析为border-width border-style border-color

### 新增：组件的宽高判断，如果没有设置，进行错误提示

### 修复: transform中添加px报错的问题

```css
.transform-translate {
    transform: translateX(100px) translateY(100px);
}
```

### 新增: 退出应用

```js
espp.exit(0)
```