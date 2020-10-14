import cn from 'classnames'
import styles from '../styles/home.module.sass'


const primary_attr = {
	'str': 'Сила',
	'agi': 'Ловкость',
	'int': 'Интеллект'
}

function strcmp(a, b) {
	if (a < b) return -1;
	if (a > b) return 1;
	return 0;
}

export const HeroTable = ({heroes, onChangeHero, activeHeroes, className, filter}) => {
	if(!heroes) return <div></div>

	const onClick = (e) => {
		const i = parseInt(e.currentTarget.getAttribute('data-id'));
		if(i !== NaN)
			onChangeHero(i);
	}


	return (
		<div>
			{ Object.keys(primary_attr).map(attr => (
				<div className={cn(styles.heroRow, className)} key={attr}>
					<div className={styles.heroRowName}>{ primary_attr[attr] }</div>
					{heroes.filter(hero => hero.primary_attr === attr).map(hero => (
						<button key={hero.name} data-id={hero._id} onClick={onClick} 
						className={ cn({[styles.active]: activeHeroes.includes(hero._id), [styles.filtered]: (filter && hero.name[0] !== filter) }) }>
							<img src={"/images/"+hero.image} alt={hero.name} />
						</button>
					))}
				</div>
			)) }
		</div>
	);
}

export function HeroSide ({title, selectCurrent, heroes, selectedHeroes, current, offset}){

	const onClick = (e) => {
		const i = parseInt(e.currentTarget.getAttribute('data-index'));
		if(i !== NaN && selectCurrent)
			selectCurrent(i);
	}

	return (
		<div className={styles.heroSide}>
			<div className={styles.heroSideName}>{title}</div>
			<div className={styles.heroSideRow}>
				{selectedHeroes.map((id, index) => (index < offset || index >= offset+5)? null:  (id >= 0?(
					<button key={heroes[id].name} data-index={index} onClick={onClick} className={ cn({[styles.current]: index===current}) }>
						<img src={"/images/"+heroes[id].image} alt={heroes[id].name} />
						<div className={styles.heroName}>{heroes[id].name}</div>
					</button>
				): (
					<button key={index} data-index={index} onClick={onClick} className={ cn({[styles.empty]: true, [styles.current]: index===current}) }>
					</button>
				)) )}
			</div>
		</div>
	);
}
