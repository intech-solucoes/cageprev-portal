import React from "react";

import { PlanoVinculadoService, FichaSalarioContribuicaoService, FichaContribPrevidencialService } from "@intechprev/ps-web-service";

import { Row, Col, Box, CampoEstatico, TipoCampoEstatico } from "@intechprev/componentes-web";
import { HomeCard } from "./HomeCard";
import { Page } from "../";

interface Props { }

interface State {
    plano: any;
    salario: any;
    ultimaContribuicao: Array<any>;
    saldos: Array<any>;
}

export class HomeAtivo extends React.Component<Props, State> {

    private page = React.createRef<Page>();

    constructor(props: Props) {
        super(props);

        this.state = {
            plano: {},
            salario: {
                VL_BASE_FUNDACAO: 0
            },
            ultimaContribuicao: [],
            saldos: []
        }
    }

    async componentDidMount() {
        await this.carregarPlano();
    }

    async carregarPlano() {
        this.page.current.loading(true);

        var plano = await PlanoVinculadoService.Buscar();
        var salario = await FichaSalarioContribuicaoService.BuscarPorPlano(plano.SQ_PLANO_PREVIDENCIAL);
        var ultimaContribuicao = await FichaContribPrevidencialService.BuscarPorPlano(plano.SQ_PLANO_PREVIDENCIAL);
        var saldos = await FichaContribPrevidencialService.BuscarSaldos(plano.SQ_PLANO_PREVIDENCIAL);

        await this.setState({ plano, salario, ultimaContribuicao, saldos });

        this.page.current.loading(false);
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
                    <Col>
                        <HomeCard titulo={"Seu Último Salário de Contribuição"} label={this.state.salario.DT_REFERENCIA}>
                            <CampoEstatico valor={this.state.salario.VL_BASE_FUNDACAO} tipo={TipoCampoEstatico.dinheiro} />
                        </HomeCard>
                    </Col>
                </Row>

                <Row className={"mt-4"}>
                    <Col>
                        <Box titulo={"Sua Última Contribuição"}>
                            
                            <table className={"table table-striped table-sm"}>
                                <tbody>
                                    {this.state.ultimaContribuicao.map((contrib, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{contrib.DS_TIPO_FUNDO} - {contrib.DS_TIPO_COBRANCA}</td>
                                                <td className={"text-right"}>
                                                    <CampoEstatico valor={contrib.VL_CONTRIBUICAO} tipo={TipoCampoEstatico.dinheiro} />
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>

                        </Box>
                    </Col>
                </Row>
                
                <Row>
                    <Col>
                        <Box titulo={"Saldos Acumulados"}>
                                
                            {this.page.current &&
                                <h3 className={"text-center text-primary mb-5"}>
                                    Parabéns! Você já acumulou <b className={"text-secondary"}>R$ <CampoEstatico valor={this.state.saldos[2].VL_ATUALIZADO} tipo={TipoCampoEstatico.dinheiro} /></b>
                                </h3>
                            }
                            
                            <table className={"table table-striped table-sm"}>
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th className={"text-right"}>Contribuições Vertidas</th>
                                        <th className={"text-right"}>Rendimentos do Plano</th>
                                        <th className={"text-right"}>Saldo Atualizado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.saldos.map((saldo, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{saldo.DS_TIPO_FUNDO}</td>
                                                <td className={"text-right"}>
                                                    <CampoEstatico valor={saldo.VL_CONTRIBUICAO} tipo={TipoCampoEstatico.dinheiro} />
                                                </td>
                                                <td className={"text-right"}>
                                                    <CampoEstatico valor={saldo.VL_RENDIMENTO} tipo={TipoCampoEstatico.dinheiro} />
                                                </td>
                                                <td className={"text-right"}>
                                                    <CampoEstatico valor={saldo.VL_ATUALIZADO} tipo={TipoCampoEstatico.dinheiro} />
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>

                        </Box>
                    </Col>
                </Row>
            </Page>
        );
    }
}