import React from "react";

import { PlanoVinculadoService } from "@intechprev/ps-web-service";

import { HomeAtivo } from "./HomeAtivo";
import { HomeAssistido } from "./HomeAssistido";
import { HomePensionista } from "./HomePensionista";
import { Page } from "..";

interface Props { }

interface State {
    plano: any;
    pensionista: boolean;
}

export class Home extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            plano: {},
            pensionista: localStorage.getItem("pensionista") === "true"
        }
    }

    componentDidMount = async () => {
        var plano = await PlanoVinculadoService.Buscar();
        await this.setState({ plano });
    }

    render() {
        if(this.state.pensionista)
            return <HomePensionista {...this.props} />
        else if(this.state.plano.SQ_SIT_PLANO === 1)
            return <HomeAtivo {...this.props} />
        else if(this.state.plano.SQ_SIT_PLANO === 3)
            return <HomeAssistido {...this.props} />
        else
            return <Page {...this.props} />;
    }
}