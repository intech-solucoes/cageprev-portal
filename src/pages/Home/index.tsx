import React from "react";

import { PlanoVinculadoService } from "@intechprev/ps-web-service";

import { HomeAtivo } from "./HomeAtivo";
import { HomeAssistido } from "./HomeAssistido";
import { Page } from "..";

interface Props { }

interface State {
    plano: any;
}

export class Home extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            plano: {}
        }
    }

    async componentDidMount() {
        var plano = await PlanoVinculadoService.Buscar();

        await this.setState({ plano });
    }

    render() {
        if(this.state.plano.SQ_SIT_PLANO === 1)
            return <HomeAtivo {...this.props} />
        else if(this.state.plano.SQ_SIT_PLANO === 3)
            return <HomeAssistido {...this.props} />
        else
            return <Page {...this.props} />;
    }
}