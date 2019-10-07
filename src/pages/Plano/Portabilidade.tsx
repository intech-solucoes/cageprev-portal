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

export class Portabilidade extends React.Component<Props, State> {
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
                    <div>
                        <Row>
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