import { Component } from 'react';
import { gamesAPI, set_page } from '../../root.js';
import { Item, GamesAPI } from '../../GamesUtil.js';
import '../../styles/Games Category.scss';

export default class Category extends Component {
	state = {
		data: [],
	};
	api = new GamesAPI(gamesAPI);
	abort = new AbortController();
	/**
	 * @returns {import('react').Ref<import('../MainLayout.js').default>}
	 */
	get layout() {
		return this.props.layout;
	}
	async fetch() {
		try {
			const data = await this.api.category(undefined, 'Most Plays', false);

			return this.setState({
				data,
			});
		} catch (error) {
			return this.setState({
				error,
			});
		}
	}
	componentDidMount() {
		this.fetch();
	}
	componentWillUnmount() {
		this.abort.abort();
	}
	render() {
		set_page('games-category');

		const items = [];

		for (let item of this.state.data) {
			items.push(
				<Item
					key={item.id}
					id={item.id}
					layout={this.props.layout}
					name={item.name}
				/>
			);
		}

		return (
			<main>
				<h1>Popular</h1>
				<div className="items">{items}</div>
			</main>
		);
	}
}
