import cn from 'classnames'
import styles from '../styles/history.module.sass'

export default function History ({history, className, title}) {
	if(history === null)
		return <div></div>


	const last = history.length > 0 ? history[history.length-1]: null;

	return (
		<div className={cn(styles.history, className)}>
			<div className={styles.date}>
				{title}
			</div>
			{last && (
				<div className={cn({[styles.main]: true, [styles.radiant]: last.wins > last.loses, [styles.dire]: last.wins < last.loses})}>
					{last.wins > last.loses && "Силы света - "}
					{last.wins < last.loses && "Силы тьмы - "}
					{last.wins === last.loses && "Силы равны - "}
					<span className={styles.gold}>{Math.max(last.wins, last.loses)} из {(last.wins+last.loses)}.</span>
				</div> 
			)}

			<div className={styles.sub}>Ключевые герои (победы / поражения)</div>
			{history.map(el => (
				<div className={styles.historyRow} key={el.name}>
					{el.name}
					{" - "}
					{el.is_radiant? <span className={styles.radiant}>силы света</span>: <span className={styles.dire}>силы тьмы</span>}
					<span style={{marginLeft: "10px"}}>
						<span className={cn(styles.score, styles.radiant)}>{el.wins}</span>
						{" / "}
						<span className={cn(styles.score, styles.dire)}>{el.loses}</span>
					</span>
				</div>
			))}
		</div>
	)
}