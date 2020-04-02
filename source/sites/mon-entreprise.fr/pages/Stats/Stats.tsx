import { ScrollToTop } from 'Components/utils/Scroll';
import React from 'react';
import emoji from 'react-easy-emoji';
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts';
import * as data from "../../../../data/stats.json";


let d202004 = data[11].values

export default function Stats() {
	return (
		<>
			<ScrollToTop />
			<h1>
				Statistiques <>{emoji('📊')}</>
			</h1>
			Ici on pourra mettre différents graphes dont le premier qui est la répartition de l'utilisation des différents simulateurs
			export default (
			<BarChart
				width={900}
				height={300}
				data={d202004}
				margin={{
					top: 20, right: 30, left: 20, bottom: 5,
				}}
			>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="key" />
				<YAxis />
				<Tooltip />
				<Legend />
				<Bar dataKey="value" fill="#8884d8" />
			</BarChart>

		</>
	)
}



