import React from "react";

import { PlanoVinculadoService, FichaSalarioContribuicaoService, FichaContribPrevidencialService, DadosPessoaisService } from "@intechprev/ps-web-service";

import { Row, Col, Box, CampoEstatico, TipoCampoEstatico } from "@intechprev/componentes-web";
import { HomeCard } from "./HomeCard";
import { Page, DadosPessoais } from "../";

interface Props { }

interface State {
    plano: any;
    salario: any;
    ultimaContribuicao: Array<any>;
    saldos: any;
    dataAposentadoria: any;
}

export class HomeAtivo extends React.Component<Props, State> {

    private page = React.createRef<Page>();

    constructor(props: Props) {
        super(props);

        this.state = {
            plano: null,
            salario: {
                VL_BASE_FUNDACAO: 0
            },
            ultimaContribuicao: [],
            saldos: {
                lista: []
            },
            dataAposentadoria: null
        }
    }

    async componentDidMount() {
        this.page.current.loading(true);

        var plano = await PlanoVinculadoService.Buscar();

        var salario = await FichaSalarioContribuicaoService.BuscarPorPlano(plano.SQ_PLANO_PREVIDENCIAL);
        var ultimaContribuicao = await FichaContribPrevidencialService.BuscarPorPlano(plano.SQ_PLANO_PREVIDENCIAL);
        var saldos = await FichaContribPrevidencialService.BuscarSaldos(plano.SQ_PLANO_PREVIDENCIAL);
        var dataAposentadoria = await DadosPessoaisService.BuscarDataAposentadoria();

        await this.setState({ plano, salario, ultimaContribuicao, saldos, dataAposentadoria });

        this.page.current.loading(false);
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

                        {/* <Row className={"mt-4"}>
                            <Col>
                                <Box titulo={"Sua Última Contribuição"} label={this.state.salario.DT_REFERENCIA}>
                                    
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
                        </Row> */}
                        
                        <Row>
                            <Col>
                                <Box titulo={"Saldos Acumulados"}>
                                        
                                    <h3 className={"text-center text-primary mb-5"}>
                                        Parabéns! Você já acumulou <b className={"text-secondary"}><CampoEstatico valor={this.state.saldos.lista[2].VL_ATUALIZADO} tipo={TipoCampoEstatico.dinheiro} /></b>
                                    </h3>
                                    
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
                                            {this.state.saldos.lista.map((saldo: any, index: number) => {
                                                // Define o tipo de linha (td ou th) baseado no index. Se for o ultimo, será o total, e será th
                                                var Td = (props: any) => <td className={props.className}>{props.children}</td>;

                                                if(index == this.state.saldos.length - 1)
                                                    Td = (props: any) => <th className={props.className}>{props.children}</th>;

                                                return (
                                                    <tr key={index}>
                                                        <Td>{saldo.DS_TIPO_FUNDO}</Td>
                                                        <Td className={"text-right"}>
                                                            <CampoEstatico valor={saldo.VL_CONTRIBUICAO} tipo={TipoCampoEstatico.dinheiro} />
                                                        </Td>
                                                        <Td className={"text-right"}>
                                                            <CampoEstatico valor={saldo.VL_RENDIMENTO} tipo={TipoCampoEstatico.dinheiro} />
                                                        </Td>
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
                        
                        {this.state.dataAposentadoria && 
                            <Row>
                                <Col>
                                    <Box>
                                        <h3 className={"text-center text-primary mb-5"}>
                                            Faltam {this.state.dataAposentadoria.Anos} anos, {this.state.dataAposentadoria.Meses} meses e {this.state.dataAposentadoria.Dias} dias para sua aposentadoria programada (aos 62 anos)
                                        </h3>
                                    </Box>
                                </Col>
                            </Row>
                        }
                    </div>
                }
            </Page>
        );
    }
}