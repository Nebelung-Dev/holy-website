import { Outlet, Link } from 'react-router-dom';
import { Component, createRef } from 'react';
import { gamesAPI, set_page } from './root.js';
import { GamesAPI } from './GamesCommon.js';
import categories from './pages/games/categories.json';
import Settings from './Settings.js';
import './styles/Games.scss';

export default class GamesLayout extends Component {
	api = new GamesAPI(gamesAPI);
	settings = new Settings('common games', {
		favorites: [],
		seen: [],
	});
	collapsable = createRef();
	state = {
		expanded: false,
		suggested: [],
		input_focused: false,
	};
	componentDidMount() {
		set_page('games');
	}
	categories = [];
	abort = new AbortController();
	category_click() {
		this.setState({ expanded: false });
	}
	constructor(props) {
		super(props);

		this.category_click = this.category_click.bind(this);

		for (let id in categories) {
			const { name } = categories[id];
			this.categories.push(
				<Link
					onClick={this.category_click}
					key={id}
					to={`/games/${id}.html`}
					className="entry text"
				>
					<span>{name}</span>
				</Link>
			);
		}
	}
	async search(query) {
		if (this.abort !== undefined) {
			this.abort.abort();
		}

		this.abort = new AbortController();

		const category = await this.api.category(
			{
				search: query,
				limit: 8,
			},
			this.abort.signal
		);

		const suggested = [];

		for (let game of category) {
			let category;

			if (game.category in categories) {
				category = categories[game.category].name;
			} else {
				console.warn(`Unknown category ${game.category}`);
				category = '';
			}
			suggested.push(
				<Link
					key={game.id}
					onClick={() => this.setState({ input_focused: false })}
					to={`/games/player.html?id=${game.id}`}
				>
					<div key={game.id}>
						<div className="name">{game.name}</div>
						<div className="category">{category}</div>
						<img
							src={`/thumbnails/${game.id}.webp`}
							alt="thumbnail"
							className="thumbnail"
						></img>
					</div>
				</Link>
			);
		}

		this.setState({
			suggested,
		});
	}
	render() {
		return (
			<>
				<nav className="games" data-expanded={Number(this.state.expanded)}>
					<div
						className="expand"
						onClick={async () => {
							await this.setState({
								expanded: !this.state.expanded,
							});

							if (this.state.expanded) {
								this.collapsable.current.focus();
							}
						}}
					>
						<div>
							<span></span>
							<span></span>
							<span></span>
							<span></span>
						</div>
					</div>
					<div
						tabIndex="0"
						className="collapsable"
						data-focused={Number(this.state.input_focused)}
						ref={this.collapsable}
						onBlur={event => {
							if (!event.target.contains(event.relatedTarget)) {
								this.setState({ expanded: false });
							}
						}}
					>
						<Link
							to="/games/popular.html"
							onClick={this.category_click}
							className="entry"
						>
							<span>Popular</span>
						</Link>
						<Link
							to="/games/favorites.html"
							onClick={this.category_click}
							className="entry"
						>
							<span>Favorites</span>
						</Link>
						{this.categories}
					</div>
					<div className="shift-right" />
					<div
						className="search-bar"
						data-focused={Number(this.state.input_focused)}
						data-suggested={Number(this.state.suggested.length !== 0)}
						onBlur={event => {
							const search_bar = event.target.parentNode;
							if (!search_bar.contains(event.relatedTarget)) {
								this.setState({ input_focused: false });
							}
						}}
					>
						<span className="eyeglass material-icons">search</span>
						<input
							type="text"
							placeholder="Search by game name"
							onFocus={event => {
								this.setState({ input_focused: true });
								this.search(event.target.value);
							}}
							onChange={event => this.search(event.target.value)}
						></input>
						<div className="suggested">
							{this.state.input_focused && this.state.suggested.length !== 0
								? this.state.suggested
								: undefined}
						</div>
					</div>
				</nav>
				<Outlet />
			</>
		);
	}
}
