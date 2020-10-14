import fs from 'fs'

export async function getHeroes () {

	const str = await fs.promises.readFile(process.cwd()+'/data/images.json');

	const heroes = JSON.parse(str)
	for(let i = 0; i < heroes.length; i++)			//Так нужно, потому что потом мы странно все это дело фильтруем
		heroes[i]._id = i;

	return heroes;
}


export async function getTree () {

	const trees = [];
	for(let i = 3; i > 0; i--){
		const str = await fs.promises.readFile(process.cwd()+`/data/tree-${i}.json`);

		const tree = JSON.parse(str);

		trees.push(tree);
	}
	
	return trees;
}
