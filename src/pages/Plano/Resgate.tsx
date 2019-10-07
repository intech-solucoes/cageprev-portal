import React from "react";
import { Page } from "..";
import { Row, Col, CampoEstatico, TipoCampoEstatico, Box } from "@intechprev/componentes-web";
import { PlanoVinculadoService, FichaContribPrevidencialService, IndiceService } from "@intechprev/ps-web-service";

interface Props { }

interface State {
    plano: any;
    saldos: any;
    dataPosicao: string;
}

export class Resgate extends React.Component<Props, State> {
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

    componentDidMount = async () => {
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

    render() {
        return (
            <Page {...this.props} ref={this.page}>
                {this.page.current &&
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
                    </Row>
                }
            </Page>
        );
    }
}