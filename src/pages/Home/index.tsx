import React from "react";
import { Page } from "../";
import { Row, Col, Box } from "@intechprev/componentes-web";
import { HomeCard } from "./HomeCard";

interface Props {

}

export class Home extends React.Component<Props> {

    private page = React.createRef<Page>();

    constructor(props: Props) {
        super(props);

        this.state = {
            dados: {
                dadosPessoais: {}
            }
        }
    }

    carregarDadosPessoais = async () => {
        // var result = await DadosPessoaisService.Buscar();
        // await this.setState({ dados: result.data });
    }

    componentDidMount = async () => {
        await this.carregarDadosPessoais();
    }

    render() {
        return (
            <Page {...this.props} ref={this.page}>

                <Row>
                    <Col>
                        <HomeCard titulo={"Plano"} conteudo={"BENEFICIO DEFINIDO"} />
                    </Col>
                    <Col>
                        <HomeCard titulo={"Situação"} conteudo={"ATIVO"} />
                    </Col>
                </Row>

            </Page>
        );
    }
}