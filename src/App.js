import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // スタイルを追加

function App() {
  const [mode, setMode] = useState(''); // モード選択用の状態

  // モードが選択されていない場合はモード選択画面を表示
  if (mode === '') {
    return (
      <div>
        <h1>学習モードを選択してください</h1>
        <button onClick={() => setMode('translation')}>和文英訳モード</button>
        <button onClick={() => setMode('freeWriting')}>自由英作文モード</button>
        <button onClick={() => setMode('speedWriting')}>瞬間英作文モード</button>
      </div>
    );
  }

  // 和文英訳モードのコンポーネントを呼び出す
  if (mode === 'translation') {
    return <TranslationMode />;
  }

  // 自由英作文モードのコンポーネントを呼び出す
  if (mode === 'freeWriting') {
    return <FreeWritingMode />;
  }

  // 瞬間英作文のコンポーネントを呼び出す
  if (mode === 'speedWriting') {
    return <SpeedWritingMode />;
  }

  return null;
}

function TranslationMode() {
  const [japaneseText, setJapaneseText] = useState('');
  const [userTranslation, setUserTranslation] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [correctionExample, setCorrectionExample] = useState(''); // 添削例の状態を追加
  const [error, setError] = useState('');

  const generateJapaneseText = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/generate');
      setGeneratedText(response.data.generatedText || response.data);
      setError('');
    } catch (error) {
      setError('日本語の文章の生成中にエラーが発生しました。');
    }
  };

  const correctTranslation = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/correct', {
        translation: userTranslation
      });
      // 添削結果のみを抽出して表示
      setCorrectionExample(response.data.correction || '添削結果がありません。');
    } catch (error) {
      setError('翻訳の添削中にエラーが発生しました。');
    }
  };

  return (
    <div>
      <h1>和文英訳学習ツール</h1>
      <button onClick={generateJapaneseText}>日本語の文章を生成</button>
      <p>{generatedText}</p>
      <textarea
        placeholder="あなたの英訳を入力してください"
        value={userTranslation}
        onChange={(e) => setUserTranslation(e.target.value)}
      />
      <button onClick={correctTranslation}>添削</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* 重複表示を削除し、添削例のみを表示 */}
      <div className="correction-box">
        <h2>添削例</h2>
        <pre>{correctionExample}</pre>
      </div>
    </div>
  );
}

function FreeWritingMode() {
  const [topic, setTopic] = useState('');
  const [userEssay, setUserEssay] = useState('');
  const [correction, setCorrection] = useState('');
  const [error, setError] = useState('');
  const [wordCount, setWordCount] = useState(0); // 語数カウントの状態

  const generateEssayTopic = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/generate-essay-topic');
      setTopic(response.data.topic || '題材が見つかりませんでした。');
      setError('');
    } catch (error) {
      setError('題材の生成中にエラーが発生しました。');
    }
  };

  const correctEssay = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/correct-essay', {
        essay: userEssay
      });
      setCorrection(response.data.correction || '添削結果がありません。');
    } catch (error) {
      setError('自由英作文の添削中にエラーが発生しました。');
    }
  };

  // ユーザーの入力を監視して語数をカウントする関数
  const handleEssayChange = (e) => {
    const text = e.target.value;
    setUserEssay(text);
    setWordCount(text.trim().split(/\s+/).filter(Boolean).length); // 語数をカウント
  };

  return (
    <div>
      <h1>自由英作文学習ツール</h1>
      <button onClick={generateEssayTopic}>自由英作文の題材を生成</button>
      <p>{topic}</p>
      <textarea
        placeholder="あなたの自由英作文を入力してください"
        value={userEssay}
        onChange={handleEssayChange} // ここで語数カウントを実行
      />
      <p>語数: {wordCount}</p> {/* 語数を表示 */}
      <button onClick={correctEssay}>添削</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>添削結果: {correction}</p>
    </div>
  );
}

function SpeedWritingMode() {
  const [userWriting, setUserWriting] = useState('');
  const [SpeedWritingTopic, setSpeedWritingTopic] = useState('');
  const [correction2, setCorrection2] = useState(''); 
  const [error, setError] = useState('');

  const generateSpeedWritingTopic = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/generate-speed-writing-topic');
      console.log(response.data); // デバッグ用
      setSpeedWritingTopic(response.data.speedWritingTopic || '題材が見つかりませんでした。');
      setError('');
    } catch (error) {
      console.error(error); // デバッグ用
      setError('瞬間英作文の題材の生成中にエラーが発生しました。');
    }
  };
  

  const correctWriting = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/correctWriting', {
        Writing: userWriting
      });
      setCorrection2(response.data.correction2 || '添削結果がありません。');
    } catch (error) {
      setError('瞬間英作文の添削中にエラーが発生しました。');
    }
  };

  return (
    <div>
     <h1>瞬間英作文ツール</h1>
     <button onClick={generateSpeedWritingTopic}>瞬間英作文の題材を作成</button>
     <p>{SpeedWritingTopic || '題材がまだ生成されていません。'}</p>
     <textarea
       placeholder="あなたの瞬間英作文を入力してください"
       value={userWriting}
       onChange={(e) => setUserWriting(e.target.value)}
      />
      <button onClick={correctWriting}>添削</button>
      {error && <p style={{ color: 'red'}}>{error}</p>}
      <p>添削結果: {correction2}</p> 
    </div>
  );
}
export default App;
