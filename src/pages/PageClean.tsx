import React from "react";

export class PageClean extends React.Component {
	render() {
		return (
			<div className="panel-login middle-box">
				<div className="logo">
                    <img src="./imagens/logo.png" alt="Logo" />
                </div>

				{this.props.children}
			</div>
		)
	}
}