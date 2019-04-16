import React, { Component } from 'react';

import { Report, ReportHeader, Page, ReportFooter } from "@ronymmoura/react-reports";
import { CampoEstatico, TipoCampoEstatico } from '@intechprev/componentes-web';

import { FichaFinancAssistidoService } from "@intechprev/ps-web-service";

const styles = {
    logo: {
        height: 100
    }
}

const Celula = (props: any) => {
    var width = props.width ? props.width : "auto";
    var colSpan = props.colSpan ? props.colSpan : null;

    return (
        <td style={{ width: width }} colSpan={colSpan}>
            <div className={"font-weight-bold"}>{props.titulo}</div>
            <div>{props.valor}</div>
        </td>
    );
}

interface Props {
    preview: boolean;
    sqProcesso: any;
    dtReferencia: any;
}

interface State {
    relatorio: any;
}

export class RelatorioContracheque extends Component<Props, State> {

    report = React.createRef<Report>();
    
    state = { 
        relatorio: {
            Plano: {} as any,
            DadosPessoais: {} as any,
            Processo: {} as any,
            Contracheque: {
                Rubricas: [] as any[],
                Resumo: {
                    Referencia: "",
                    DataCredito: "",
                    Bruto: 0,
                    Descontos: 0,
                    Liquido: 0
                }
            }
        }
    }

    async componentDidMount() {
        var relatorio = await FichaFinancAssistidoService.BuscarRelatorioPorProcessoReferencia(this.props.sqProcesso, this.props.dtReferencia);
        await this.setState({ relatorio });
    }

    download = async () => {
        await this.report.current.downloadPDF();
    }

	render() {
		return (
			<Report ref={this.report} preview={this.props.preview}>

                <ReportHeader height={100}>
                    <table>
                        <tbody>
                            <tr>
                                <td className={"text-center"} style={{ width: 170 }}>
                                    <img src="http://www.cageprev.com/wp-content/uploads/2016/07/Logo-Cageprev.png" alt="Logo Cageprev" style={styles.logo} />
                                </td>
                                <td style={{ verticalAlign: "top" }}>
                                    <div className={"font-weight-bold"}>CAGEPREV – Fundação CAGECE de Previdência Complementar</div>
                                    <div className={"font-weight-bold"}>06.025.140/0001-09</div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </ReportHeader>
                
                <Page>
                    <h4 className={"mb-3 text-center"}>CONTRACHEQUE</h4>

                    <table className={"table table-bordered table-sm"}>
                        <tbody>
                            <tr>
                                <Celula titulo={"Nome"} valor={this.state.relatorio.DadosPessoais.NO_PESSOA} colSpan={3} />
                                <Celula titulo={"Data de Início"} valor={this.state.relatorio.DadosPessoais.DT_ADMISSAO} width={120} />
                                <Celula titulo={"Mês/Ano"} valor={this.state.relatorio.Contracheque.Resumo.Referencia.substring(3)} width={70} />
                            </tr>
                            <tr>
                                <Celula titulo={"Plano"} valor={this.state.relatorio.Plano.DS_PLANO_PREVIDENCIAL} />
                                <Celula titulo={"Espécie de Benefício"} valor={this.state.relatorio.Processo.DS_ESPECIE} colSpan={2} />
                                <Celula titulo={"CPF"} valor={this.state.relatorio.DadosPessoais.NR_CPF} />
                                <Celula titulo={"Matrícula"} valor={this.state.relatorio.Plano.NR_INSCRICAO} />
                            </tr>
                            <tr>
                                <Celula titulo={"Data de Crédito"} valor={this.state.relatorio.Contracheque.Resumo.DataCredito} />
                                <Celula titulo={"Banco"} valor={this.state.relatorio.DadosPessoais.CD_BANCO} />
                                <Celula titulo={"Agência"} valor={this.state.relatorio.DadosPessoais.CD_AGENCIA} />
                                <Celula titulo={"Número da Conta"} valor={`${this.state.relatorio.DadosPessoais.NR_CC}-${this.state.relatorio.DadosPessoais.DV_CC}`} colSpan={2} />
                            </tr>
                        </tbody>
                    </table>

                    <table className={"table table-bordered table-striped table-sm"}>
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Descrição</th>
                                <th>Data</th>
                                <th>Parcela</th>
                                <th>Prazo</th>
                                <th>Base</th>
                                <th>Proventos</th>
                                <th>Descontos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.relatorio.Contracheque.Rubricas.map((rubrica: any, index: number) => {
                                    return (
                                        <tr key={index}>
                                            <td>{rubrica.CD_RUBRICA}</td>
                                            <td>{rubrica.DS_RUBRICA}</td>
                                            <td>{rubrica.DT_REFERENCIA.substring(3)}</td>
                                            <td>{rubrica.NR_PARCELA}/{rubrica.QT_PARCELA}</td>
                                            <td>{rubrica.QT_PRAZO}</td>
                                            <td>{rubrica.VL_BASE_CALCULO.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                            <td>
                                                {rubrica.VAL_PROVENTO && rubrica.VAL_PROVENTO.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </td>
                                            <td className={"text-danger"}>
                                                {rubrica.VAL_DESCONTO && rubrica.VAL_DESCONTO.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </td>
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </table>

                    <table className={"table table-bordered table-sm"}>
                        <tfoot>
                            <tr>
                                <th>
                                    <span className="float-left">Total de Proventos:</span>
                                    <span className="float-right">
                                        {this.state.relatorio.Contracheque.Resumo.Bruto.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </th>
                                <th>
                                    <span className="float-left">Total de Descontos:</span>
                                    <span className="float-right">
                                        {this.state.relatorio.Contracheque.Resumo.Descontos.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </th>
                                <th>
                                    <span className="float-left">Valor Líquido:</span>
                                    <span className="float-right">
                                        {this.state.relatorio.Contracheque.Resumo.Liquido.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </th>
                            </tr>
                        </tfoot>
                    </table>
                </Page>
			</Report>
		);
	}
}