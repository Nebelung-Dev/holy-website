import Layout from './Layout.js';
import { ObfuscateLayout } from './obfuscate.js';
import { Outlet } from 'react-router-dom';
import './styles/Proxy Script.scss';

export default class ProxyLayout extends Layout {
	render() {
		this.update();

		return (
			<>
				<ObfuscateLayout />
				<Outlet />
			</>
		);
	}
}
