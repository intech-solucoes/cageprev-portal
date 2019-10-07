import React from "react";
import { Page } from "..";
import { Row, Col, CampoEstatico, TipoCampoEstatico, Box } from "@intechprev/componentes-web";
import { PlanoVinculadoService, FichaContribPrevidencialService, IndiceService } from "@intechprev/ps-web-service";

import { HomeCard } from "../Home/HomeCard";
import { Link } from "react-router-dom";

import { Extrato } from "./Extrato";
import { Resgate } from "./Resgate";
import { Portabilidade } from "./Portabilidade";
export { Extrato, Resgate, Portabilidade }

interface Props { }

interface State {
    plano: any;
    saldos: any;
    dataPosicao: string;
}

export class Plano extends React.Component<Props, State> {
    private page = React.createRef<Page>();

    constructor(props: Props) {
        super(props);

        this.state = {
            plano: null,
            saldos: {
                lista: []
            },
            dataPosicao: ""
        }
    }

    async componentDidMount() {
        this.page.current.loading(true);

        var plano = await PlanoVinculadoService.Buscar();
        var saldos = await FichaContribPrevidencialService.BuscarSaldos(plano.SQ_PLANO_PREVIDENCIAL);
        var indice = await IndiceService.BuscarUltimoPorCdIndice("QUOTA");

        await this.setState({ 
            plano, 
            saldos,
            dataPosicao: indice.DT_INIC_VALIDADE.substring(3)
         });

        this.page.current.loading(false);
    }

    async gerarExtrato() {
        alert("Em construção");
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
                                <Box titulo={"Saldos Acumulados"} label={`Posição de ${this.state.dataPosicao}`}>
                                        
                                    <h3 className={"text-center text-primary mb-5"}>
                                        Parabéns! Você já acumulou <b className={"text-secondary"}><CampoEstatico valor={this.state.saldos.lista[2].VL_ATUALIZADO} tipo={TipoCampoEstatico.dinheiro} /></b>
                                    </h3>
                                    
                                    <table className={"table table-striped table-sm"}>
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th className={"text-right"}>Saldo Atualizado</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.saldos.lista.map((saldo: any, index: number) => {
                                                // Define o tipo de linha (td ou th) baseado no index. Se for o ultimo, será o total, e será th
                                                var Td = (props: any) => <td className={props.className}>{props.children}</td>;

                                                if(index == this.state.saldos.lista.length - 1)
                                                    Td = (props: any) => <th className={props.className}>{props.children}</th>;

                                                return (
                                                    <tr key={index}>
                                                        <Td>{saldo.DS_TIPO_FUNDO}</Td>
                                                        <Td className={"text-right"}>
                                                            <CampoEstatico valor={saldo.VL_ATUALIZADO} tipo={TipoCampoEstatico.dinheiro} />
                                                        </Td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>

                                </Box>
                            </Col>
                        </Row>
                        
                        <Row>
                            <Col tamanho={"sm-12"} className={"col-md-4"}>
                                <Box titulo={"Extrato"}>
                                    <h5>Visualize e baixe o seu extrato de contribuições atualizado</h5>
                                    <Link className="btn btn-primary btn-block mt-3" id="esqueciSenha" to="/extrato">Ir para Extrato</Link>
                                </Box>
                            </Col>
                            
                            <Col tamanho={"sm-12"} className={"col-md-4"}>
                                <Box titulo={"Simulador de Resgate"}>
                                    <h5>Simule o valor atualizado do seu resgate de contribuições</h5>
                                    <Link className="btn btn-primary btn-block mt-3" id="esqueciSenha" to="/resgate">Ir para Simulador de Resgate</Link>
                                </Box>
                            </Col>
                            
                            <Col tamanho={"sm-12"} className={"col-md-4"}>
                                <Box titulo={"Simulador de Portabilidade"}>
                                    <h5>Simule o valor atualizado do seu saldo para portabilidade</h5>
                                    <Link className="btn btn-primary btn-block mt-3" id="esqueciSenha" to="/portabilidade">Ir para Simulador de Portabilidade</Link>
                                </Box>
                            </Col>
                        </Row>
                    </div>
                }
            </Page>
        );
    }
}