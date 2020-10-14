import cn from 'classnames'
import { getHeroes, getTree } from '../data/get-data.js'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import useSWR from 'swr'

import { HeroTable, HeroSide } from '../components/heroes.jsx'
import History from '../components/history.jsx'

import { MdSwapHoriz } from 'react-icons/md'

import styles from '../styles/home.module.sass'

const fetcher = url => fetch(url).then(r => r.json())

//Это общая функция, ее потом просто в отельный файл
const check = (priznak, match) => {
	if("hero_side" in priznak){
		const pos = match.heroesMatch.indexOf(priznak.hero_side);

		if(pos < 0)
			 return 0;

		if(pos < 5)		//Если герой есть в силах света
			return 1;

		return 2;			//Если герой есть в силах тьмы
	}

	return 0;
}

export default function Home({ heroes, trees }) {

	const [ selectedHeroes, setSelectedHeroes ] = useState(new Array(10).fill(-1));
	const [ current, setCurrent ] = useState(0);
	const [ filter, setFilter ] = useState('');
	const [ mode, setMode ] = useState(0);
	const [ histories, setHistories ] = useState([]);

	useEffect(() => {
		const keydown = (e) => {

			if(e.keyCode >= 65 && e.keyCode <= 90){
				if(String.fromCharCode(e.keyCode) === filter)
					setFilter('');
				else
					setFilter(String.fromCharCode(e.keyCode));
			}
			
			if(e.key === "Escape" || e.key === "Backspace"){
				setFilter('');
				setMode(0);
			}

			if(e.keyCode >= 48 && e.keyCode <= 58)
				setCurrent(e.keyCode === 48?9 : e.keyCode-49);
			
		}
		document.addEventListener("keydown", keydown);
		return () => {
			document.removeEventListener("keydown", keydown);
		}
	}, [filter]);

	const setHero = (id) => {

		let i;
		if((i = selectedHeroes.indexOf(id)) < 0){
			setSelectedHeroes(selectedHeroes.map((item, index) => (index === current)? id: item))
			setFilter('');
			if(current < 9 && selectedHeroes[current+1] < 0)		//Сдвигаем этот селектор на следущую клетку, если она пустая
				setCurrent(current+1);
		}else{
			setSelectedHeroes(selectedHeroes.map((item, index) => (index === i)? -1: item));
			setCurrent(i);
		}
			

	}

	const selectCurrent = (index) => {
		if(index == current)
			setSelectedHeroes(selectedHeroes.map((item, index) => (index === current)? -1: item))
		else
			setCurrent(index);

		setMode(0);
	}

	const swapHeroes = () => {
		const _heroes = [];
		for(let i = 0;  i < 5; i++)
			_heroes.push(selectedHeroes[i+5]);
		for(let i = 0;  i < 5; i++)
			_heroes.push(selectedHeroes[i]);

		setSelectedHeroes(_heroes);
		if(current < 5)
			setCurrent(current + 5);
		else
			setCurrent(current - 5);
	}


	const calculate = () => {
		const match = {
			heroesMatch: selectedHeroes.map((item, index) => (item < 0)? -1: heroes[item].id)
		}

		const heroesId = [];
		for(let hero of heroes)
			heroesId[hero.id] = hero;

		const histories = [];
		for(let tree of trees){
			let _tree = tree;
			const history = [];
			while(!_tree.leaf){
				const k = check(_tree.priznak, match);

				if(k > 0){
					history.push( {name: heroesId[_tree.priznak.hero_side].name, is_radiant: k === 1, wins: _tree.children[k].wins, loses: _tree.children[k].loses } )
				}

				_tree = _tree.children[k];
			}

			histories.push(history);
		}

		setMode(1);
		setHistories(histories);

	}

	return (
		<div className="main">
			<Head>
				<title>Проводник в мир DOTA 2</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<div className={styles.phrase}>ВЫБЕРИТЕ ПИК ДЛЯ АНАЛИЗА ИГРЫ</div>
			<div className={styles.row}>
				<HeroSide title="Силы света" heroes={heroes} offset={0} selectedHeroes={selectedHeroes} selectCurrent={selectCurrent} current={current}/>
				<button className={cn(styles.button, styles.swap)} onClick={swapHeroes}><MdSwapHoriz size="1.2em"/></button>
				<HeroSide title="Силы тьмы" heroes={heroes} offset={5} selectedHeroes={selectedHeroes} selectCurrent={selectCurrent} current={current}/>
			</div>
			<button className={styles.button} onClick={calculate}>
				Узнать исход матча
			</button>

			<HeroTable heroes={heroes} onChangeHero={setHero} filter={filter} activeHeroes={selectedHeroes} className={(mode !== 0) && styles.disabled}/>
			{(mode === 1) && (
				<div className={styles.centerRow}>
					{ histories.map((history, index) => <History title={titleArray[index]} history={history} key={index}/> ) }
				</div>
			)}
		</div>
	)
}

const titleArray = [
	"Данные за три месяца",
	"Данные за два месяца",
	"Данные за месяц"
]

export async function getStaticProps() {
	const heroes = await getHeroes();
	const trees = await getTree();
	return {
		props: {
			heroes,
			trees
		}
	}
}

