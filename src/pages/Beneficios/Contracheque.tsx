import React from "react";

import { PlanoVinculadoService, ProcessoBeneficioService, FichaFinancAssistidoService } from "@intechprev/ps-web-service";

import { Row, Col, Box, CampoEstatico, TipoCampoEstatico, Button } from "@intechprev/componentes-web";
import { Page } from "../";
import { Link } from "react-router-dom";

interface Props {
    match?: any;
}

interface State {
    contracheque: any;
    sqProcesso: number;
    dtReferencia: string;
}

export class Contracheque extends React.Component<Props, State> {

    private page = React.createRef<Page>();

    constructor(props: Props) {
        super(props);

        this.state = {
            contracheque: {
                Proventos: [],
                Descontos: [],
                Resumo: {}
            },
            sqProcesso: props.match.params.sqProcesso,
            dtReferencia: props.match.params.dtReferencia
        }
    }

    async componentDidMount() {
        await this.page.current.loading(true);

        var contracheque = await FichaFinancAssistidoService.BuscarPorProcessoReferencia(this.state.sqProcesso, this.state.dtReferencia);

        await this.setState({ contracheque });

        await this.page.current.loading(false);
    }

    async gerarRelatorio() {

    }

    render() {
        return (
            <Page {...this.props} ref={this.page}>
                {this.page.current &&
                    <Row>
                        <Col className={"col-lg-4"}>
                            <Box>
                                <Row className={"text-center"}>

                                    <Col className={"col-lg-4"}>
                                        <h5>BRUTO</h5>
                                        <span className="text text-info">R$ {this.state.contracheque.Resumo.Bruto.toLocaleString('pt-br', {minimumFractionDigits: 2})}</span>
                                    </Col>

                                    <Col className={"col-lg-4"}>
                                        <h5>DESCONTOS</h5>
                                        <span className="text text-danger">R$ {this.state.contracheque.Resumo.Descontos.toLocaleString('pt-br', {minimumFractionDigits: 2})}</span>
                                    </Col>

                                    <Col className={"col-lg-4"}>
                                        <h5>LÍQUIDO</h5>
                                        <span className="text text-success">R$ {this.state.contracheque.Resumo.Liquido.toLocaleString('pt-br', {minimumFractionDigits: 2})}</span>
                                    </Col>

                                </Row>
                            </Box>
                        </Col>

                        <Col className={"col-lg-12"}>
                            <Box>
                                <Row>

                                    <Col className={"col-lg-6"}>
                                        <h2>
                                            <i className="fa fa-plus-circle text-success mr-2"></i>
                                            Rendimentos
                                        </h2>
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th>Descrição</th>
                                                    <th>Valor</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    this.state.contracheque.Proventos.map((rendimento: any, index: number) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>{rendimento.DS_RUBRICA}</td>
                                                                <td><CampoEstatico valor={rendimento.VL_CALCULO} tipo={TipoCampoEstatico.dinheiro} /></td>
                                                            </tr>
                                                        );
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </Col>

                                    <Col className={"col-lg-6"}>
                                        <h2>
                                            <i className="fa fa-minus-circle text-danger mr-2"></i>
                                            Descontos
                                        </h2>
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th>Descrição</th>
                                                    <th>Valor</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    this.state.contracheque.Descontos.map((desconto: any, index: any) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>{desconto.DS_RUBRICA}</td>
                                                                <td>-<CampoEstatico valor={desconto.VL_CALCULO} tipo={TipoCampoEstatico.dinheiro} /></td>
                                                            </tr>
                                                        );
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </Col>

                                </Row>

                                {/* <Button titulo={"Baixar"} className="btn btn-primary" onClick={this.gerarRelatorio} /> */}
                                
                            </Box>
                        </Col>
                    </Row>
                }
            </Page>
        );
    }
}