import React from "react";

import { PlanoVinculadoService, FichaSalarioContribuicaoService, FichaContribPrevidencialService } from "@intechprev/ps-web-service";

import { Row, Col, Box, CampoEstatico, TipoCampoEstatico } from "@intechprev/componentes-web";
import { HomeCard } from "./HomeCard";
import { Page } from "../";

interface Props { }

interface State {
    plano: any;
}

export class HomeAssistido extends React.Component<Props, State> {

    private page = React.createRef<Page>();

    constructor(props: Props) {
        super(props);

        this.state = {
            plano: {}
        }
    }

    async componentDidMount() {
        await this.carregarPlano();
    }

    async carregarPlano() {
        await this.page.current.loading(true);

        var plano = await PlanoVinculadoService.Buscar();

        await this.setState({ plano });

        await this.page.current.loading(false);
    }

    render() {
        return (
            <Page {...this.props} ref={this.page}>
                <Row>
                    <Col>
                        <HomeCard titulo={"Plano"}>
                            {this.state.plano.DS_PLANO_PREVIDENCIAL}
                        </HomeCard>
                    </Col>
                    <Col tamanho={"lg-3"}>
                        <HomeCard titulo={"Situação"}>
                            {this.state.plano.DS_SIT_PLANO}
                        </HomeCard>
                    </Col>
                </Row>
            </Page>
        );
    }
}