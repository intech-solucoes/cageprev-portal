import React from "react";
import { Page } from "..";
import { Row, Col, Box, CampoTexto, Botao, TipoBotao, Form } from "@intechprev/componentes-web";
import { PlanoVinculadoService, FichaContribPrevidencialService, IndiceService } from "@intechprev/ps-web-service";

interface Props { }

interface State {
    plano: any;
    saldos: any;
    dataInicial: string;
    dataFinal: string;
    dataPosicao: string;
}

export class Extrato extends React.Component<Props, State> {
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

    componentDidMount = async () => {
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
            dataPosicao: indice.DT_INIC_VALIDADE.substring(3)
         });

        this.page.current.loading(false);
    }

    gerarExtrato = async () => {
        alert("Em construção");
    }

    render() {
        return (
            <Page {...this.props} ref={this.page}>
                {this.page.current &&
                    <Row>
                        <Col>
                            <Box titulo={"Extrato de Contribuições"}>
                                <Form ref={this.form}>
                                    <CampoTexto contexto={this} nome={"dataInicial"} valor={this.state.dataInicial} tamanhoLabel={"lg-2"} tamanhoCampo={"lg-2"}
                                                label={"Data Inicial"} mascara={"99/99/9999"} />
                                                
                                    <CampoTexto contexto={this} nome={"dataFinal"} valor={this.state.dataFinal} tamanhoLabel={"lg-2"} tamanhoCampo={"lg-2"}
                                                label={"Data Final"} mascara={"99/99/9999"} />
                                                
                                    <Botao titulo={"Gerar"} tipo={TipoBotao.primary} submit onClick={this.gerarExtrato} />
                                </Form>
                            </Box>
                        </Col>
                    </Row>
                }
            </Page>
        );
    }
}