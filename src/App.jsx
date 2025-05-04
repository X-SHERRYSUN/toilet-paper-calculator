import { useState } from "react";

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

function App() {
  const [numPoops, setNumPoops] = useState(0);
  const [poops, setPoops] = useState([]);
  const [result, setResult] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleNumPoopsChange = (e) => {
    const value = parseInt(e.target.value);
    setNumPoops(value);
    const newPoops = Array(value).fill().map(() => ({
      length: "",
      shape: "條狀",
      cleanLevel: "普通",
      actualUsed: "",
    }));
    setPoops(newPoops);
    setResult(null);
    setShowModal(false);
  };

  const handlePoopChange = (index, field, value) => {
    const updated = [...poops];
    updated[index][field] = value;
    setPoops(updated);
  };

  const getSuggested = (poop) => {
    const { length, shape, cleanLevel } = poop;
    if (length === "") return null;
    const base = Number(length) * 1.2;
    const shapeFactor = shapeFactorMap[shape] ?? 1;
    const cleanFactor = cleanFactorMap[cleanLevel] ?? 1;
    return Math.round(base * shapeFactor * cleanFactor);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let totalActual = 0;
    let totalSuggested = 0;
    let count = 0;

    poops.forEach((poop) => {
      const suggested = getSuggested(poop);
      const actual = Number(poop.actualUsed);
      if (!isNaN(suggested) && !isNaN(actual)) {
        totalActual += actual;
        totalSuggested += suggested;
        count++;
      }
    });

    if (count === 0) {
      setResult(null);
      setShowModal(false);
      return;
    }

    const avgActual = Math.round(totalActual / count);
    const avgSuggested = Math.round(totalSuggested / count);

    let ecoMessage = "";
    if (avgActual > avgSuggested + 1) {
      ecoMessage = "🌳 喔不～你平均使用太多了，幫樹木省點力吧 😢";
    } else if (avgActual < avgSuggested) {
      ecoMessage = "🌱 你是今天的環保小尖兵！謝謝你愛護地球 💚";
    } else {
      ecoMessage = "👍 你的使用量跟建議差不多，繼續保持！";
    }


    setResult({
      usage: `你今天平均每次使用了 ${avgActual} 張一般抽取式衛生紙 🧻`,
      suggestion: `建議用量：約 ${avgSuggested} 張/次`,
      ecoMessage,
    });
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-green-100 p-4 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold text-green-700 mb-8 text-center animate-pulse">
        🧻 衛生紙用量計算器
      </h1>

      <div className="bg-green-50 p-4 rounded-xl shadow-md w-full max-w-xl mb-6">
        <label className="block font-semibold text-gray-700 mb-2">
          今天上幾次大號💩？
        </label>
        <select
          value={numPoops}
          onChange={handleNumPoopsChange}
          className="w-full p-3 border rounded-lg bg-green-100 shadow-inner"
        >
          <option value={0}>請選擇次數</option>
          {[1, 2, 3].map((n) => (
            <option key={n} value={n}>
              {n} 次
            </option>
          ))}
        </select>
      </div>

      {numPoops > 0 && (
        <form
          onSubmit={handleSubmit}
          className="bg-green-50 rounded-2xl shadow-lg p-6 w-full max-w-xl space-y-8"
        >
          {poops.map((poop, index) => (
            <div
              key={index}
              className="border rounded-xl p-6 bg-emerald-50 space-y-5 shadow-xl"
            >
              <h2 className="font-semibold text-green-600 text-lg">
                💩 第 {index + 1} 次
              </h2>

              <div>
                <label className="block font-medium">
                  長度（單位：以一根15cm🍌為基準，💩=幾根🍌）
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  className="w-full p-3 border rounded-lg bg-green-100 shadow-inner"
                  value={poop.length}
                  onChange={(e) =>
                    handlePoopChange(index, "length", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block font-medium">形狀</label>
                <select
                  className="w-full p-3 border rounded-lg bg-green-100 shadow-inner"
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
                  className="w-full p-3 border rounded-lg bg-green-100 shadow-inner"
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

              <div>
                <label className="block font-medium">
                  你實際用了幾張（一般抽取式）
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full p-3 border rounded-lg bg-green-100 shadow-inner"
                  value={poop.actualUsed}
                  onChange={(e) =>
                    handlePoopChange(index, "actualUsed", e.target.value)
                  }
                />
              </div>
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-green-400 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-full shadow-lg"
          >
            🧻 計算今天的衛生紙用量
          </button>
        </form>
      )}

      {/* Modal */}
      {showModal && result && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-11/12 max-w-md text-center space-y-4">
            <div className="text-xl font-semibold text-green-800">
              {result.usage}
            </div>
            <div className="text-gray-700 font-medium">{result.suggestion}</div>
            <div className="text-green-600 font-bold text-lg animate-bounce">
              {result.ecoMessage}
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full"
            >
              關閉
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
