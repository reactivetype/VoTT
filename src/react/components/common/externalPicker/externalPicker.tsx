import React, { SyntheticEvent } from "react";
import axios, { AxiosRequestConfig } from "axios";
import { FieldProps } from "react-jsonschema-form";
import { interpolate } from "../../../../common/strings";

interface IKeyValuePair {
    key: string;
    value: string;
}

/**
 * Options for External Picker
 * @member method - HTTP method
 * @member url - URL for request
 * @member keySelector - Key attribute from HTTP response
 * @member valueSelector - Value attribute from HTTP response
 * @member authHeaderName - Authorization header name
 * @member authHeaderValue - Authorization header value
 */
export interface IExternalPickerUiOptions {
    method: string;
    url: string;
    keySelector: string;
    valueSelector: string;
    authHeaderName?: string;
    authHeaderValue?: string;
}

/**
 * Properties for External Picker
 * @member options - External Picker UI options
 */
export interface IExternalPickerProps extends FieldProps {
    options: IExternalPickerUiOptions;
}

/**
 * State for External Picker
 * @member items - Items loaded from external source as options
 */
export interface IExternalPickerState {
    items: IKeyValuePair[];
}

/**
 * Dropdown that provides options from an external HTTP source
 */
export default class ExternalPicker extends React.Component<IExternalPickerProps, any> {
    constructor(props, context) {
        super(props, context);

        this.state = {
            items: [],
        };

        this.onChange = this.onChange.bind(this);
    }

    public render() {
        return (
            <select id={this.props.id}
                className="form-control"
                value={this.props.value}
                onChange={this.onChange}>
                <option value="">Select {this.props.schema.title}</option>
                {this.state.items.map((item) => <option key={item.key} value={item.key}>{item.value}</option>)}
            </select>
        );
    }

    public async componentDidMount() {
        await this.bindExternalData();
    }

    public async componentDidUpdate(prevProps: FieldProps) {
        if (prevProps.formContext !== this.props.formContext) {
            await this.bindExternalData();
        }
    }

    private onChange(e: SyntheticEvent) {
        const target = e.target as HTMLSelectElement;
        this.props.onChange(target.value === "" ? undefined : target.value);
    }

    private async bindExternalData() {
        const uiOptions = this.props.options;
        const customHeaders: any = {};
        const authHeaderValue = interpolate(uiOptions.authHeaderValue, {
            props: this.props,
        });

        if (!authHeaderValue || authHeaderValue === "undefined") {
            return;
        }

        customHeaders[uiOptions.authHeaderName] = authHeaderValue;

        const config: AxiosRequestConfig = {
            method: uiOptions.method,
            url: uiOptions.url,
            headers: customHeaders,
        };

        try {
            const response = await axios.request(config);
            const items: IKeyValuePair[] = response.data.map((item) => {
                return {
                    key: interpolate(uiOptions.keySelector, { item }),
                    value: interpolate(uiOptions.valueSelector, { item }),
                };
            });

            this.setState({
                items,
            });
        } catch (e) {
            return;
        }
    }
}
