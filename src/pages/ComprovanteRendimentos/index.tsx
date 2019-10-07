import React from "react";

import { Page } from "..";
import { Box, Combo, Row, Col, CampoEstatico, TipoCampoEstatico } from "@intechprev/componentes-web";
import { ComprovanteRendimentosService } from "@intechprev/ps-web-service";

interface Props {

}

interface State {
    datas: Array<any>;
    anoCalendario: string;
    comprovante: Array<any>;    
}

export class ComprovanteRendimentos extends React.Component<Props, State> {

    private page = React.createRef<Page>();

    constructor(props: Props) {
        super(props);

        this.state = {
            anoCalendario: null,
            datas: [],
            comprovante: []
        }
    }

    componentDidMount = async() => {
        var datas = await ComprovanteRendimentosService.BuscarDatas();

        this.setState({
            datas
        });

        if(datas.length > 0) {
            this.setState({
                anoCalendario: datas[0].ANO_CALENDARIO
            });

            await this.trocarAno();
        }
    }

    trocarAno = async() => {
        var comprovante = await ComprovanteRendimentosService.BuscarPorAnoCalendario(this.state.anoCalendario);

        this.setState({
            comprovante
        });
    }

    render() {
        return (
            <Page {...this.props} ref={this.page}>
                <Row>
                    <Col tamanho={"8"}>
                        <Box>
                            <Combo contexto={this} nome={"anoCalendario"} label={"Período"} 
                                valor={this.state.anoCalendario} opcoes={this.state.datas}
                                valorMembro={"ANO_CALENDARIO"} nomeMembro={"DS_ANO_CALENDARIO"} onChange={this.trocarAno} />

                            {this.state.comprovante.map((item, index) => {
                                return (
                                    <Row key={index} className={"mb-3"}>
                                        <Col>{item.DS_ITEM_DECLARACAO}</Col>
                                        <Col tamanho={"2"} className={"text-right"}>
                                            <CampoEstatico valor={item.VL_DECLARACAO} tipo={TipoCampoEstatico.dinheiro} />
                                        </Col>
                                    </Row>
                                )
                            })}
                        </Box>
                    </Col>
                </Row>
            </Page>
        );
    }
}