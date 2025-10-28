# transform
```java

  public static void processTransform(HippyArray transforms, double[] result) {
    double[] helperMatrix = sHelperMatrix.get();
    MatrixUtil.resetIdentityMatrix(result);

    for (int transformIdx = 0, size = transforms.size(); transformIdx < size; transformIdx++) {
      HippyMap transform = transforms.getMap(transformIdx);
      String transformType = transform.keySet().iterator().next();

      assert helperMatrix != null;
      MatrixUtil.resetIdentityMatrix(helperMatrix);
      Object value = transform.get(transformType);
      if ("matrix".equals(transformType) && value instanceof HippyArray) {
        HippyArray matrix = (HippyArray) value;
        for (int i = 0; i < 16; i++) {
          Object matrixValue = matrix.getObject(i);
          if (matrixValue instanceof Number) {
            helperMatrix[i] = ((Number) matrixValue).doubleValue();
          }
        }
      } else if ("perspective".equals(transformType) && value instanceof Number) {
        MatrixUtil.applyPerspective(helperMatrix, ((Number) value).doubleValue());
      } else if ("rotateX".equals(transformType)) {
        MatrixUtil.applyRotateX(helperMatrix, convertToRadians(transform, transformType));
      } else if ("rotateY".equals(transformType)) {
        MatrixUtil.applyRotateY(helperMatrix, convertToRadians(transform, transformType));
      } else if ("rotate".equals(transformType) || "rotateZ".equals(transformType)) {
        MatrixUtil.applyRotateZ(helperMatrix, convertToRadians(transform, transformType));
      } else if ("scale".equals(transformType) && value instanceof Number) {
        double scale = ((Number) value).doubleValue();
        MatrixUtil.applyScaleX(helperMatrix, scale);
        MatrixUtil.applyScaleY(helperMatrix, scale);
      } else if ("scaleX".equals(transformType) && value instanceof Number) {
        MatrixUtil.applyScaleX(helperMatrix, ((Number) value).doubleValue());
      } else if ("scaleY".equals(transformType)) {
        MatrixUtil.applyScaleY(helperMatrix, ((Number) value).doubleValue());
      } else if ("translate".equals(transformType) && value instanceof HippyArray) {
        double x = 0d, y = 0d, z = 0d;

        if (((HippyArray) value).size() > 0) {
          Object tranX = ((HippyArray) value).getObject(0);
          if (tranX instanceof Number) {
            x = ((Number) tranX).doubleValue();
          }
        }

        if (((HippyArray) value).size() > 1) {
          Object tranY = ((HippyArray) value).getObject(1);
          if (tranY instanceof Number) {
            y = ((Number) tranY).doubleValue();
          }
        }

        if (((HippyArray) value).size() > 2) {
          Object tranZ = ((HippyArray) value).getObject(2);
          if (tranZ instanceof Number) {
            z = ((Number) tranZ).doubleValue();
          }
        }
        MatrixUtil.applyTranslate3D(helperMatrix, x, y, z);
      } else if ("translateX".equals(transformType) && value instanceof Number) {
        MatrixUtil.applyTranslate2D(helperMatrix, ((Number) value).doubleValue(), 0d);
      } else if ("translateY".equals(transformType) && value instanceof Number) {
        MatrixUtil.applyTranslate2D(helperMatrix, 0d, ((Number) value).doubleValue());
      } else if ("skewX".equals(transformType)) {
        MatrixUtil.applySkewX(helperMatrix, convertToRadians(transform, transformType));
      } else if ("skewY".equals(transformType)) {
        MatrixUtil.applySkewY(helperMatrix, convertToRadians(transform, transformType));
      } else {
        RuntimeException runtimeException = new RuntimeException(
            "Unsupported transform type: " + transformType);
        runtimeException.printStackTrace();
      }

      MatrixUtil.multiplyInto(result, result, helperMatrix);
    }
  }

```

这段 Java 方法是一个 矩阵变换处理器，主要用于将一个数组形式的多段 CSS 样式（如 translate, rotate, scale 等）解析为一个 最终 4x4 变换矩阵，常见于 React Native、Hippy 等框架在原生侧对 JS transform 数据的处理。

⸻

✅ 方法签名解析：

public static void processTransform(HippyArray transforms, double[] result)

	•	transforms: JS 传入的一组变换操作（如 [{"translateX": 100}, {"scale": 1.5}]），包装为 HippyArray。
	•	result: 最终结果矩阵（长度为 16 的 double 数组），表示将所有变换合并后的 4x4 变换矩阵。

⸻

🧱 方法整体逻辑结构：
1.	初始化辅助矩阵 helperMatrix 和目标矩阵 result（设置为单位矩阵）。
2.	遍历 transforms 数组，对每一个 transform（对象）：
•	读取类型和值（如 "translateX"、100）
•	初始化辅助矩阵为单位矩阵
•	根据类型调用不同的 MatrixUtil.applyXXX() 生成对应变换矩阵
•	将生成的变换矩阵与 result 相乘（组合变换）

⸻

🧠 支持的变换类型及处理方式：

变换类型	示例	处理方式（方法）
matrix	{matrix: [16个数]}	直接构造矩阵
perspective	{perspective: 500}	applyPerspective(...)
rotate, rotateX, rotateY, rotateZ	{rotateZ: '45deg'}	转角度为弧度后用 applyRotateX/Y/Z
scale	{scale: 1.2}	X/Y 轴同时缩放
scaleX, scaleY	单独轴缩放
translate	[x, y, z]	三维平移
translateX, translateY	二维平移
skewX, skewY	斜切（使用弧度）
❌ 其他未支持	抛异常


⸻

🔁 矩阵乘法部分

每个变换操作都会生成一个新的变换矩阵，最后通过：

MatrixUtil.multiplyInto(result, result, helperMatrix);

将其叠加到最终结果矩阵中，顺序等价于：

finalMatrix = Tn × ... × T2 × T1 × Identity

顺序符合 transform 的先写后执行逻辑。

⸻

✳️ convertToRadians 辅助函数

你会看到多个地方调用：

convertToRadians(transform, transformType)

这个函数应该是将 transform.get(transformType) 的值从 "45deg" 或 "0.5rad" 这样的单位字符串转换成 double 类型的弧度值，供旋转、倾斜等操作使用。

⸻

✅ 示例解释

如果你传入的 transforms 是：

[
{ "translateX": 100 },
{ "rotateZ": "90deg" },
{ "scale": 2 }
]

它将按顺序生成：
1.	translateX 矩阵
2.	rotateZ 矩阵（将 “90deg” 转成 π/2 弧度）
3.	scale 矩阵（缩放 X/Y）

最后它会把这三个矩阵依次乘入结果矩阵中，形成一个完整的 4x4 变换矩阵。

⸻

📌 应用场景

这个方法通常用在：
•	原生端还原前端 transform 效果
•	Web → Native transform 的桥接中间层
•	OpenGL 或 Android Canvas 绘图中还原 UI 变换
•	三维模型、视图投影处理

⸻

如果你还想看 MatrixUtil 的实现、或者想把这个方法移植成 JS/TS 工具函数，我也可以帮你转化。有需要吗？