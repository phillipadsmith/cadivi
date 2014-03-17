#!/usr/bin/env perl

use strict;
use warnings;
use Mojo::Loader;
use Mojo::Template;
use Mojo::Util qw/ encode slurp spurt /;
use Text::CSV;
use FindBin '$Bin';
use utf8::all;
use autodie;
use Data::Dumper;
use Getopt::Long;

GetOptions(
    'input=s'  => \my $input_file,
    'output=s' => \my $output_file,
) or die( "Error in command line arguments\n" );
die( "--input and --output must be specified" )
    unless $input_file && $output_file;


my $csv = Text::CSV->new({ binary => 1, eol => $/ });

open my $io, "<", $input_file;

my $headers = [];
for my $name ( $csv->column_names($csv->getline ($io)) ) {
    push $headers, $name;
}; 

my $fields = [];
while ( my $row = $csv->getline_hr ($io) ) {
    push $fields, $row;
};

my @args = ( $headers, $fields );


my $loader   = Mojo::Loader->new;
my $template = $loader->data( __PACKAGE__, 'table' );
my $mt       = Mojo::Template->new;
my $output_html = $mt->render( $template, @args );
$output_html = encode 'UTF-8', $output_html;

# Write the template output to a filehandle
spurt $output_html, $output_file;

__DATA__
@@ table
% my ( $headers, $fields ) = @_;
<table> 
    <thead> 
        <tr>
% for my $h ( @$headers ) {
            <th scope="col"><%= $h %></th>
% };
        </tr>
    </thead> 
    <tbody> 
%        for my $r ( @$fields ) {
        <tr>
% for my $h ( @$headers ) {
            <td><%= $r->{ $h } %></td>
%        };
        </tr>
% };
    </tbody>
</table>
