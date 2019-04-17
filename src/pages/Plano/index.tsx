import React from "react";
import { Page } from "..";
import { Row, Col, CampoEstatico, TipoCampoEstatico, Box, CampoTexto, Button, TipoBotao, Form } from "@intechprev/componentes-web";
import { PlanoVinculadoService, FichaContribPrevidencialService, IndiceService } from "@intechprev/ps-web-service";

import { HomeCard } from "../Home/HomeCard";

interface Props { }

interface State {
    plano: any;
    saldos: any;
    dataInicial: string;
    dataFinal: string;
    dataPosicao: string;
}

export class Plano extends React.Component<Props, State> {
    private page = React.createRef<Page>();
    private form = React.createRef<Form>();

    constructor(props: Props) {
        super(props);

        this.state = {
            plano: null,
            saldos: {
                lista: []
            },
            dataInicial: "",
            dataFinal: "",
            dataPosicao: ""
        }
    }

    async componentDidMount() {
        this.page.current.loading(true);

        var plano = await PlanoVinculadoService.Buscar();

        var saldos = await FichaContribPrevidencialService.BuscarSaldos(plano.SQ_PLANO_PREVIDENCIAL);
        var datasExtrato = await FichaContribPrevidencialService.BuscarDatasExtratoPorPlano(plano.SQ_PLANO_PREVIDENCIAL);
        var indice = await IndiceService.BuscarUltimoPorCdIndice("QUOTA");

        await this.setState({ 
            plano, 
            saldos,
            dataInicial: datasExtrato.DataInicial,
            dataFinal: datasExtrato.DataFinal,
            dataPosicao: indice.DT_INIC_VALIDADE
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
                                        Parabéns! Você já acumulou <b className={"text-secondary"}>R$ <CampoEstatico valor={this.state.saldos.lista[2].VL_ATUALIZADO} tipo={TipoCampoEstatico.dinheiro} /></b>
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

                                                if(index == this.state.saldos.length - 1)
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
                            <Col>
                                <Box titulo={"Extrato de Contribuições"}>
                                    <Form ref={this.form}>
                                        <Row>
                                            <Col tamanho={"lg-3"}>
                                                <CampoTexto contexto={this} nome={"dataInicial"} valor={this.state.dataInicial} tamanhoLabel={"lg-5"}
                                                            label={"Data Inicial"} mascara={"99/99/9999"} />
                                            </Col>
                                            <Col tamanho={"lg-3"}>
                                                <CampoTexto contexto={this} nome={"dataFinal"} valor={this.state.dataFinal} tamanhoLabel={"lg-5"}
                                                            label={"Data Final"} mascara={"99/99/9999"} />
                                            </Col>
                                            <Col>
                                                <Button titulo={"Gerar"} tipo={TipoBotao.primary} submit onClick={this.gerarExtrato} />
                                            </Col>
                                        </Row>
                                    </Form>
                                </Box>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <Box titulo={"Simulador de Resgate"} label={`Posição de ${this.state.dataPosicao}`}>
                                    
                                    <p>
                                        Art. 33. Excetuado o caso de falecimento, o PARTICIPANTE que ainda não estiver em gozo de aposentadoria-programada, inclusive sob a forma 
                                        antecipada, ou de aposentadoria por invalidez, e que tiver cancelada a sua inscricão no PCV, poderá optar pelo recebimento, a título de resgate-de-contribuições,
                                        do montante em Reais equivalente a cem por cento (100%) do saldo, em quotas, de suas contribuições-laborais vertidas para a sua conta-de-participante.
                                    </p>

                                    <table className={"table table-striped table-sm"}>
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th className={"text-right"}>Saldo Atualizado</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>VALOR BRUTO</td>
                                                <td className={"text-right"}>
                                                    <CampoEstatico valor={this.state.saldos.bruto} tipo={TipoCampoEstatico.dinheiro} />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>DESCONTO DE IRRF</td>
                                                <td className={"text-right"}>
                                                    <CampoEstatico valor={this.state.saldos.IRRF} tipo={TipoCampoEstatico.dinheiro} />
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>VALOR LÍQUIDO</th>
                                                <th className={"text-right"}>
                                                    <CampoEstatico valor={this.state.saldos.liquido} tipo={TipoCampoEstatico.dinheiro} />
                                                </th>
                                            </tr>
                                        </tbody>
                                    </table>

                                </Box>
                            </Col>

                            <Col>
                                <Box titulo={"Simulador de Portabilidade"} label={`Posição de ${this.state.dataPosicao}`}>
                                    
                                    <p>
                                        Art. 34. O PARTICIPANTE que optar pelo instituto da portabilidade poderá transferir os recursos financeiros correspondentes ao seu direito-acumulado
                                        para outro plano de benefícios de caráter previdenciário operado por entidade de previdência complementar ou sociedade seguradora autorizada
                                        a operar essa modalidade de plano.
                                    </p>

                                    <table className={"table table-striped table-sm"}>
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th className={"text-right"}>Saldo Atualizado</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <th>VALOR A SER PORTADO</th>
                                                <th className={"text-right"}>
                                                    <CampoEstatico valor={this.state.saldos.lista[2].VL_ATUALIZADO} tipo={TipoCampoEstatico.dinheiro} />
                                                </th>
                                            </tr>
                                        </tbody>
                                    </table>

                                </Box>
                            </Col>
                        </Row>
                    </div>
                }
            </Page>
        );
    }
}