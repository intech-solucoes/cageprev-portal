import React from "react";

import { PlanoVinculadoService, ProcessoBeneficioService, FichaFinancAssistidoService } from "@intechprev/ps-web-service";

import { Row, Col, Box, CampoEstatico, TipoCampoEstatico } from "@intechprev/componentes-web";
import { Page } from "../";
import { Link } from "react-router-dom";

import { Contracheques } from "./Contracheques";
import { ContrachequeDetalhe } from "./ContrachequeDetalhe";
import { RelatorioContracheque } from "./RelatorioContracheque";

export {
    Contracheques,
    ContrachequeDetalhe,
    RelatorioContracheque
}

interface Props { }

interface State {
    plano: any;
    processo: any;
    datasFicha: Array<any>;
}

export class Beneficios extends React.Component<Props, State> {

    private page = React.createRef<Page>();

    constructor(props: Props) {
        super(props);

        this.state = {
            plano: {},
            processo: {},
            datasFicha: []
        }
    }

    componentDidMount = async () => {
        await this.page.current.loading(true);

        var plano = await PlanoVinculadoService.Buscar();
        var processo = await ProcessoBeneficioService.BuscarPorPlano(plano.SQ_PLANO_PREVIDENCIAL);
        var datasFicha = await FichaFinancAssistidoService.BuscarDatasPorProcesso(processo.SQ_PROCESSO);

        await this.setState({ plano, processo, datasFicha });

        await this.page.current.loading(false);
    }

    render() {
        return (
            <Page {...this.props} ref={this.page}>
                <Row>
                    <Col tamanho={"lg-6"}>
                        <Box>
                            <div className="form-row">
                                <CampoEstatico titulo={"Plano"} valor={this.state.plano.DS_PLANO_PREVIDENCIAL} />
                                <CampoEstatico titulo={"Processo"} valor={`${this.state.processo.NR_PROCESSO}/${this.state.processo.NR_ANO_PROCESSO}`} />
                            </div>

                            <div className="form-row">
                                <CampoEstatico titulo={"Benefício"} valor={this.state.processo.DS_ESPECIE} />
                                <CampoEstatico titulo={"Data Concessão"} valor={this.state.processo.DT_CONCESSAO} />
                            </div>

                            <div className="form-row">
                                <CampoEstatico titulo={"Situação"} valor={this.state.processo.DS_MOT_SITUACAO} />
                            </div>

                            <Link className="btn btn-primary btn-block mt-3" id="esqueciSenha" to="/contracheques">Demonstrativos de Pagamento - Contracheque</Link>
                        </Box>
                    </Col>
                </Row>
            </Page>
        );
    }
}