import { useState } from "react";

const defaultPoops = [
  { sheetsUsed: "", paperType: "roll", shape: "條狀", cleanLevel: "普通", length: "" },
  { sheetsUsed: "", paperType: "roll", shape: "條狀", cleanLevel: "普通", length: "" },
  { sheetsUsed: "", paperType: "roll", shape: "條狀", cleanLevel: "普通", length: "" },
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
  const [numPoops, setNumPoops] = useState(1);
  const [result, setResult] = useState(null);

  const handlePoopChange = (index, field, value) => {
    const newPoops = [...poops];
    newPoops[index][field] = value;
    setPoops(newPoops);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    for (let i = 0; i < numPoops; i++) {
      if (poops[i].sheetsUsed === "" || poops[i].sheetsUsed <= 0) {
        alert(`請輸入第 ${i + 1} 次大便使用的衛生紙數量`);
        return;
      }
    }

    let totalUsedInSheetEquivalent = 0;
    let totalPoops = 0;

    for (let i = 0; i < numPoops; i++) {
      const poop = poops[i];
      const used = Number(poop.sheetsUsed);
      if (used > 0) {
        totalPoops++;

        const paperWeight = used * toiletPaperFactors[poop.paperType];
        const sheetEquivalent = paperWeight / toiletPaperFactors.sheet;

        const shapeFactor = shapeFactorMap[poop.shape] || 1;
        const cleanFactor = cleanFactorMap[poop.cleanLevel] || 1;
        const lengthFactor = poop.length ? Math.max(1, parseFloat(poop.length)) : 1;

        const adjustedSheets = sheetEquivalent * shapeFactor * cleanFactor * lengthFactor;

        totalUsedInSheetEquivalent += adjustedSheets;
      }
    }

    const averageUsed = totalPoops > 0 ? Math.round(totalUsedInSheetEquivalent / totalPoops) : 0;

    let ecoMessage = "";
    if (averageUsed > 6) {
      ecoMessage = "🌳 喔不～你平均每次使用太多了，一起來節省衛生紙吧 😢";
    } else if (totalPoops > 0) {
      ecoMessage = "🌱 你很節省喔！你是今天的環保小尖兵！謝謝你愛護地球 💚";
    }

    setResult({
      usage: `你今天平均每次使用了 ${averageUsed} 張一般抽取式衛生紙 🧻`,
      ecoMessage,
    });
  };

  return (
    <div className="min-h-screen bg-green-100 p-4 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold text-green-700 mb-8 text-center animate-pulse">
        🧻 衛生紙用量計算器
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-green-50 rounded-2xl shadow-lg p-6 w-full max-w-xl space-y-8"
      >
        <p className="text-center text-gray-700 font-semibold">
          請選擇今天最多幾次的 💩 狀況：
        </p>

        <div className="text-center">
          <select
            value={numPoops}
            onChange={(e) => setNumPoops(Number(e.target.value))}
            className="p-3 border rounded-lg bg-green-100 shadow-inner"
          >
            {[1, 2, 3].map((num) => (
              <option key={num} value={num}>
                {num} 次
              </option>
            ))}
          </select>
        </div>

        <div className="h-6" />

        {Array.from({ length: numPoops }).map((_, index) => (
          <div
            key={index}
            className="border rounded-xl p-6 bg-emerald-50 space-y-5 shadow-xl"
          >
            <h2 className="font-semibold text-green-600 text-lg">
              💩 第 {index + 1} 次
            </h2>

            <div>
              <label className="block font-medium">你使用的衛生紙種類？</label>
              <select
                className="w-full p-3 border rounded-lg bg-green-100 shadow-inner"
                value={poops[index].paperType}
                onChange={(e) =>
                  handlePoopChange(index, "paperType", e.target.value)
                }
              >
                {paperOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium">
                便便長度（單位:🍌，請填寫大概等於幾根香蕉）
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                className="w-full p-3 border rounded-lg bg-green-100 shadow-inner"
                value={poops[index].length}
                onChange={(e) =>
                  handlePoopChange(index, "length", e.target.value)
                }
              />
            </div>

            <div>
              <label className="block font-medium">形狀</label>
              <select
                className="w-full p-3 border rounded-lg bg-green-100 shadow-inner"
                value={poops[index].shape}
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
                className="w-full p-3 border rounded-lg bg-green-100 shadow-inner"
                value={poops[index].cleanLevel}
                onChange={(e) =>
                  handlePoopChange(index, "cleanLevel", e.target.value)
                }
              >
                <option>普通</option>
                <option>有點潔癖</option>
                <option>極度潔癖</option>
              </select>
            </div>

            <div>
              <label className="block font-medium">
                你實際用了幾{poops[index].paperType === "roll" ? "格" : "張"}？
              </label>
              <input
                type="number"
                min="0"
                className="w-full p-3 border rounded-lg bg-green-100 shadow-inner"
                value={poops[index].sheetsUsed}
                onChange={(e) =>
                  handlePoopChange(index, "sheetsUsed", e.target.value)
                }
              />
            </div>
          </div>
        ))}

        <div className="h-6" />

        <button
          type="submit"
          className="w-full bg-green-400 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-full shadow-lg"
        >
          🧻 計算今天的衛生紙用量⬇️
        </button>
      </form>

      {result && (
        <div className="mt-8 text-center bg-white p-6 rounded-2xl shadow-xl space-y-4">
          <div className="text-xl font-semibold text-green-800">
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
