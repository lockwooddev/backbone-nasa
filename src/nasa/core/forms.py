from django import forms


class AssetsForm(forms.Form):

    lat = forms.FloatField()
    lon = forms.FloatField()
    begin = forms.DateField(required=False)
    end = forms.DateField(required=False)


class ImageryForm(forms.Form):

    lat = forms.FloatField()
    lon = forms.FloatField()
    date = forms.DateField(required=False)
    cloud_score = forms.BooleanField(required=False)
