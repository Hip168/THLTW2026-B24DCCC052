import { useState } from 'react';

export type Choice = 'Kéo' | 'Búa' | 'Bao';
export type GameResult = 'Thắng' | 'Thua' | 'Hòa';

export interface GameRecord {
	playerChoice: Choice;
	computerChoice: Choice;
	result: GameResult;
	playedAt: string;
}

const CHOICES: Choice[] = ['Kéo', 'Búa', 'Bao'];


const WIN_MAP: Record<Choice, Choice> = {
	Kéo: 'Búa',
	Búa: 'Bao',
	Bao: 'Kéo',
};

export default () => {
	const [history, setHistory] = useState<GameRecord[]>([]);
	const [lastRecord, setLastRecord] = useState<GameRecord | null>(null);

	const getRandomChoice = (): Choice => CHOICES[Math.floor(Math.random() * 3)];




	const play = (playerChoice: Choice) => {
		const computerChoice = getRandomChoice();


		let result: GameResult;
		if (playerChoice === computerChoice) {
			result = 'Hòa';
		} else if (WIN_MAP[computerChoice] === playerChoice) {
			result = 'Thua';
		} else {
			result = 'Thắng';
		}

		const record: GameRecord = {
			playerChoice,
			computerChoice,
			result,
			playedAt: new Date().toISOString(),
		};

		setLastRecord(record);
		setHistory((prev) => [record, ...prev]);
	};

	const clearHistory = () => {
		setHistory([]);
		setLastRecord(null);
	};

	const stats = {
		total: history.length,
		wins: history.filter((r) => r.result === 'Thắng').length,
		losses: history.filter((r) => r.result === 'Thua').length,
		draws: history.filter((r) => r.result === 'Hòa').length,
	};

	return {
		history,
		lastRecord,
		play,
		clearHistory,
		stats,
	};
};
