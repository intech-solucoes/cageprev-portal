import React from "react";

import { FichaFinancAssistidoService } from "@intechprev/ps-web-service";

import { Row, Col, Box, CampoEstatico, TipoCampoEstatico, Botao, TipoBotao, TamanhoBotao } from "@intechprev/componentes-web";
import { Page } from "..";
import { RelatorioContracheque } from ".";

interface Props {
    match?: any;
}

interface State {
    contracheque: any;
    sqProcesso: number;
    dtReferencia: string;
}

export class ContrachequeDetalhe extends React.Component<Props, State> {

    private page = React.createRef<Page>();
    private relatorioContracheque = React.createRef<RelatorioContracheque>();

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
        await this.relatorioContracheque.current.download();
    }

    render() {
        return (
            <Page {...this.props} ref={this.page} titulo={"Demonstrativos de Pagamento - Contracheque " + this.state.dtReferencia.replace(".", "/").replace(".", "/").substring(3)}>
                {this.page.current &&
                    <div>
                        <Row>
                            <Col tamanho={"lg-6"}>
                                <Box renderRow={false}>
                                    <Row className={"text-center"}>

                                        <Col tamanho={"lg-3"}>
                                            <h5>BRUTO</h5>
                                            <span className="text text-info">R$ {this.state.contracheque.Resumo.Bruto.toLocaleString('pt-br', {minimumFractionDigits: 2})}</span>
                                        </Col>

                                        <Col tamanho={"lg-3"}>
                                            <h5>DESCONTOS</h5>
                                            <span className="text text-danger">R$ {this.state.contracheque.Resumo.Descontos.toLocaleString('pt-br', {minimumFractionDigits: 2})}</span>
                                        </Col>

                                        <Col tamanho={"lg-3"}>
                                            <h5>LÍQUIDO</h5>
                                            <span className="text text-success">R$ {this.state.contracheque.Resumo.Liquido.toLocaleString('pt-br', {minimumFractionDigits: 2})}</span>
                                        </Col>

                                    </Row>
                                </Box>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <Box renderRow={false}>
                                    <Row>
                                        <Col>
                                            <h2>
                                                <i className="fa fa-plus-circle text-success mr-2"></i>
                                                Rendimentos
                                            </h2>
                                            <table className="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th>Descrição</th>
                                                        <th style={{ textAlign: "right" }}>Valor</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        this.state.contracheque.Proventos.map((rendimento: any, index: number) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>{rendimento.DS_RUBRICA}</td>
                                                                    <td style={{ width: 120, textAlign: "right" }}><CampoEstatico valor={rendimento.VL_CALCULO} tipo={TipoCampoEstatico.dinheiro} /></td>
                                                                </tr>
                                                            );
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        </Col>

                                        <Col>
                                            <h2>
                                                <i className="fa fa-minus-circle text-danger mr-2"></i>
                                                Descontos
                                            </h2>
                                            <table className="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th>Descrição</th>
                                                        <th style={{ textAlign: "right" }}>Valor</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        this.state.contracheque.Descontos.map((desconto: any, index: any) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>{desconto.DS_RUBRICA}</td>
                                                                    <td style={{ width: 120, textAlign: "right" }}>-<CampoEstatico valor={desconto.VL_CALCULO} tipo={TipoCampoEstatico.dinheiro} /></td>
                                                                </tr>
                                                            );
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        </Col>

                                    </Row>

                                    <Botao titulo="Baixar" tipo={TipoBotao.primary} tamanho={TamanhoBotao.pequeno} onClick={() => this.relatorioContracheque.current.download()} />
                                    <RelatorioContracheque ref={this.relatorioContracheque} preview={false} sqProcesso={this.state.sqProcesso} dtReferencia={this.state.dtReferencia} />
                                </Box>
                            </Col>
                        </Row>
                    </div>
                }
            </Page>
        );
    }
}