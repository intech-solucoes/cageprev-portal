import React from "react";
import * as _ from "lodash";

import { PlanoVinculadoService, ProcessoBeneficioService, FichaFinancAssistidoService } from "@intechprev/ps-web-service";

import { Row, Col, Box, CampoEstatico, TipoCampoEstatico, Alert, TipoAlerta } from "@intechprev/componentes-web";
import { HomeCard } from "./HomeCard";
import { Page } from "../";

interface Props { }

interface State {
    plano: any;
    processo: any;
    ficha: Array<any>;
}

export class HomeAssistido extends React.Component<Props, State> {

    private page = React.createRef<Page>();

    constructor(props: Props) {
        super(props);

        this.state = {
            plano: {},
            processo: {},
            ficha: []
        }
    }

    async componentDidMount() {
        await this.carregarPlano();
    }

    async carregarPlano() {
        await this.page.current.loading(true);

        var plano = await PlanoVinculadoService.Buscar();
        var processo = await ProcessoBeneficioService.BuscarPorPlano(plano.SQ_PLANO_PREVIDENCIAL);
        var ficha = await FichaFinancAssistidoService.BuscarUltimaPorProcesso(processo.SQ_PROCESSO);

        await this.setState({ plano, processo, ficha });

        await this.page.current.loading(false);
    }

    render() {
        return (
            <Page {...this.props} ref={this.page}>
                {this.page.current &&
                    <div>
                        <Row>
                            <Col>
                                <HomeCard titulo={"Plano"}>
                                    {this.state.plano.DS_PLANO_PREVIDENCIAL}
                                </HomeCard>
                            </Col>
                            <Col>
                                <HomeCard titulo={"Situação"}>
                                    {this.state.plano.DS_SIT_PLANO}
                                </HomeCard>
                            </Col>
                        </Row>

                        <Row className={"mt-4"}>
                            <Col>
                                <HomeCard titulo={"Benefício"}>
                                    {this.state.processo.DS_ESPECIE}
                                </HomeCard>
                            </Col>
                            <Col>
                                <HomeCard titulo={"Processo"}>
                                    {this.state.processo.NR_PROCESSO}/{this.state.processo.NR_ANO_PROCESSO}
                                </HomeCard>
                            </Col>
                        </Row>

                        <Row className={"mt-4"}>
                            <Col>
                                <HomeCard titulo={"Data Concessão"}>
                                    {this.state.processo.DT_CONCESSAO}
                                </HomeCard>
                            </Col>
                            <Col>
                                <HomeCard titulo={"Situação"}>
                                    {this.state.processo.DS_MOT_SITUACAO}
                                </HomeCard>
                            </Col>
                        </Row>

                        <Row className={"mt-4"}>
                            <Col>
                                {this.state.ficha.length > 0 &&
                                    <Box titulo={"Última Folha "} label={"competência " + this.state.ficha[0].DT_COMPETENCIA}>

                                        <h3 className={"text-center text-primary mb-5"}>
                                            Valor Líquido: <b className={"text-secondary"}><CampoEstatico valor={_.sumBy(this.state.ficha, 'VL_CALCULO')} tipo={TipoCampoEstatico.dinheiro} /></b>
                                        </h3>
                                        
                                        <table className={"table table-striped table-sm"}>
                                            <thead>
                                                <tr>
                                                    <th>Rubrica</th>
                                                    <th className={"text-right"}>Tipo</th>
                                                    <th className={"text-right"}>Valor</th>
                                                </tr>
                                            </thead>
                                            
                                            <tbody>
                                                {this.state.ficha.map((item, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{item.DS_RUBRICA}</td>
                                                            <td className={"text-right"}>{item.DS_LANCAMENTO}</td>
                                                            <td className={"text-right"}>
                                                                <CampoEstatico valor={item.VL_CALCULO} tipo={TipoCampoEstatico.dinheiro} />
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>

                                    </Box>
                                }

                                {this.state.ficha.length == 0 &&
                                    <Alert tipo={TipoAlerta.danger} mensagem="Não foi possível buscar sua última folha" />
                                }
                            </Col>
                        </Row>
                    </div>
                }
            </Page>
        );
    }
}