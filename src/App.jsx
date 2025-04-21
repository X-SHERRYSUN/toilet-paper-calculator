import { useState } from "react";

const defaultPoops = [
  { length: "", shape: "條狀", cleanLevel: "普通" },
  { length: "", shape: "條狀", cleanLevel: "普通" },
  { length: "", shape: "條狀", cleanLevel: "普通" },
];

const shapeFactorMap = {
  "條狀": 1,
  "一整陀": 1.2,
  "水狀": 1.4,
  "顆粒狀": 0.8,
};

const cleanFactorMap = {
  "普通": 1,
  "有點潔癖": 1.1,
  "極度潔癖": 1.2,
};

const toiletPaperFactors = {
  roll: 1.2,
  sheet: 0.5,
  "triple-sheet": 0.3,
};

const paperOptions = [
  { value: "roll", label: "滾筒式" },
  { value: "sheet", label: "一般抽取式" },
  { value: "triple-sheet", label: "三層式抽取式" },
];

function App() {
  const [poops, setPoops] = useState(defaultPoops);
  const [paperType, setPaperType] = useState("roll");
  const [result, setResult] = useState(null);

  const handlePoopChange = (index, field, value) => {
    const newPoops = [...poops];
    newPoops[index][field] = value;
    setPoops(newPoops);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let totalSquares = 0;
    let totalPoops = 0;

    poops.forEach((poop) => {
      if (poop.length !== "") {
        totalPoops++;
        const base = Number(poop.length) * 4;
        const cleanFactor = cleanFactorMap[poop.cleanLevel] ?? 1;
        const shapeFactor = shapeFactorMap[poop.shape] ?? 1;
        totalSquares += base * cleanFactor * shapeFactor;
      }
    });

    const factor = toiletPaperFactors[paperType] ?? 1;
    const finalAmount = Math.round(totalSquares * factor);
    const averageAmount = totalPoops > 0 ? Math.round(finalAmount / totalPoops) : 0;

    let ecoMessage = "";
    if (
      (paperType === "triple-sheet" && averageAmount > 3) ||
      (paperType === "sheet" && averageAmount > 4) ||
      (paperType === "roll" && averageAmount > 7)
    ) {
      ecoMessage = "🌳 喔不～你平均每次使用了太多衛生紙，等於砍了一小片樹林 😢 一起節省吧！";
    } else if (totalPoops > 0) {
      ecoMessage = "🌱 你是今天的環保小尖兵！謝謝你愛護地球 💚";
    }

    setResult({
      usage: `你今天平均每次需要 ${averageAmount} ${
        paperType === "roll" ? "格" : "張"
      }${paperOptions.find((p) => p.value === paperType)?.label} 🧻`,
      ecoMessage,
    });
  };

  return (
    <div className="min-h-screen bg-pink-100 p-4 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold text-pink-600 mb-8 text-center animate-pulse">
        🧻 衛生紙用量計算器
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-xl space-y-8"
      >
        <p className="text-center text-gray-700 font-semibold">
          請輸入你今天最多三次的 💩 狀況（可留空）
        </p>

        {poops.map((poop, index) => (
          <div
            key={index}
            className="border rounded-xl p-6 bg-yellow-50 space-y-5 shadow-xl"
          >
            <h2 className="font-semibold text-pink-500 text-lg">
              💩 第 {index + 1} 次
            </h2>

            <div>
              <label className="block font-medium">便便長度（以一根15公分的🍌為基準）</label>
              <input
                type="number"
                min="0"
                step="0.1"
                className="w-full p-3 border rounded-lg bg-yellow-100 shadow-inner"
                value={poop.length}
                onChange={(e) =>
                  handlePoopChange(index, "length", e.target.value)
                }
              />
            </div>

            <div>
              <label className="block font-medium">形狀</label>
              <select
                className="w-full p-3 border rounded-lg bg-yellow-100 shadow-inner"
                value={poop.shape}
                onChange={(e) =>
                  handlePoopChange(index, "shape", e.target.value)
                }
              >
                <option>條狀</option>
                <option>一整陀</option>
                <option>水狀</option>
                <option>顆粒狀</option>
              </select>
            </div>

            <div>
              <label className="block font-medium">潔癖程度</label>
              <select
                className="w-full p-3 border rounded-lg bg-yellow-100 shadow-inner"
                value={poop.cleanLevel}
                onChange={(e) =>
                  handlePoopChange(index, "cleanLevel", e.target.value)
                }
              >
                <option>普通</option>
                <option>有點潔癖</option>
                <option>極度潔癖</option>
              </select>
            </div>
          </div>
        ))}

        <div>
          <label className="block font-medium">你使用的衛生紙種類？</label>
          <select
            className="w-full p-3 border rounded-lg bg-yellow-100 shadow-inner"
            value={paperType}
            onChange={(e) => setPaperType(e.target.value)}
          >
            {paperOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="h-6" />

        <button
          type="submit"
          className="w-full bg-pink-400 hover:bg-pink-500 text-white font-bold py-3 px-6 rounded-full shadow-lg"
        >
          🧻 計算今天的衛生紙用量
        </button>
      </form>

      {result && (
        <div className="mt-8 text-center bg-white p-6 rounded-2xl shadow-xl space-y-4">
          <div className="text-xl font-semibold text-pink-800">
            {result.usage}
          </div>
          {result.ecoMessage && (
            <div className="text-green-600 font-bold text-lg animate-bounce">
              {result.ecoMessage}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
